import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { BookStatus, Event } from '@prisma/client';
import { BookEvent } from '../book-domain/events/book.events';
import { Condition } from '../book-domain/enums/condition.enum';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BookEventTypes } from '../book-domain/enums/book-event-types.enum';
import { EventStoreService } from '../../event-sourcing/event-store/event-store.service';
import { SnapshotService } from '../../event-sourcing/snapshot/snapshot.service';
import { BookEventRehydrationService } from '../book-domain/book-event-rehydration.service';

const SNAPSHOT_THRESHOLD = 3;

@Injectable()
export class BookCommandService {
  private readonly logger = new Logger(BookCommandService.name);

  constructor(
    private readonly eventStore: EventStoreService,
    private readonly snapshotService: SnapshotService,
    private readonly bookEventRehydrationService: BookEventRehydrationService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  private async recordAndApply(bookEvent: BookEvent) {
    const newRevision =
      (await this.eventStore.getCountByAggregateId(bookEvent.bookId)) + 1;

    const storedEvent = await this.eventStore.appendEvent(
      bookEvent.bookId,
      newRevision,
      bookEvent.type,
      bookEvent.data,
    );
    await this.emitEvent(storedEvent);
    await this.createSnapshotIfNeeded(bookEvent, newRevision);
  }

  private async createSnapshotIfNeeded(
    bookEvent: BookEvent,
    newRevision: number,
  ) {
    if (newRevision % SNAPSHOT_THRESHOLD === 0) {
      const aggregate = await this.bookEventRehydrationService.rehydrate(
        bookEvent.bookId,
      );
      const state = aggregate.getState();
      await this.snapshotService.appendSnapshot(
        bookEvent.bookId,
        state.revision,
        state,
      );
    }
  }

  async registerBook({
    isbn,
    title,
    author,
  }: {
    isbn: string;
    title: string;
    author: string;
  }) {
    const event: BookEvent = {
      bookId: crypto.randomUUID(),
      type: BookEventTypes.BookRegistered,
      data: { isbn, title, author },
    };

    this.logger.log(`Registering book with ISBN: ${isbn}`);

    await this.recordAndApply(event);
    return {
      bookId: event.bookId,
    };
  }

  async borrowBook({ bookId, readerId }: { bookId: string; readerId: string }) {
    const aggregate = await this.bookEventRehydrationService.rehydrate(bookId);
    const state = aggregate.getState();
    if (state.status !== BookStatus.AVAILABLE)
      throw new ConflictException('Book not available');

    const event: BookEvent = {
      type: BookEventTypes.BookBorrowed,
      bookId: bookId,
      data: { readerId },
    };
    await this.recordAndApply(event);
  }

  async returnBook({
    bookId,
    condition,
  }: {
    bookId: string;
    condition: Condition;
  }) {
    const aggregate = await this.bookEventRehydrationService.rehydrate(bookId);
    const state = aggregate.getState();
    if (state.status !== BookStatus.BORROWED)
      throw new ConflictException('Book not borrowed');

    const event: BookEvent = {
      type: BookEventTypes.BookReturned,
      bookId: bookId,
      data: { condition },
    };
    await this.recordAndApply(event);
  }

  async repairBook({ bookId, comment }: { bookId: string; comment: string }) {
    const aggregate = await this.bookEventRehydrationService.rehydrate(bookId);
    const state = aggregate.getState();
    if (state.status !== BookStatus.DAMAGED)
      throw new ConflictException('Book not damaged');

    const event: BookEvent = {
      type: BookEventTypes.BookRepaired,
      bookId: bookId,
      data: { comment },
    };
    await this.recordAndApply(event);
  }

  async removeBook({ bookId, reason }: { bookId: string; reason: string }) {
    const aggregate = await this.bookEventRehydrationService.rehydrate(bookId);
    const state = aggregate.getState();
    if (state.status === BookStatus.REMOVED)
      throw new ConflictException('Already removed');

    const event: BookEvent = {
      type: BookEventTypes.BookRemoved,
      bookId: bookId,
      data: { reason },
    };

    await this.recordAndApply(event);
  }

  async replayEvents(bookId: string, revision?: number) {
    const events = await this.eventStore.getEventsByAggregateId(
      bookId,
      revision,
    );

    for (const event of events) {
      await this.emitEvent(event);
    }
  }

  private async emitEvent(event: Event) {
    this.logger.log('Emitting event: ' + event.type);
    await this.eventEmitter.emitAsync(event.type, event);
  }
}
