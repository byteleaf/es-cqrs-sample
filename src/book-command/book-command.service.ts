import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { EventStoreService } from '../event-store/event-store.service';
import { BookStatus, Event, Prisma } from '@prisma/client';
import { BookEvent } from './events/book.events';
import { SnapshotService } from '../snapshot/snapshot.service';
import { BookAggregate, BookState } from './aggregates/book.aggregate';
import { Condition } from './enums/condition.enum';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BookEventTypes } from '../common/enums/book-event-types.enum';

const SNAPSHOT_THRESHOLD = 3;

@Injectable()
export class BookCommandService {
  private readonly logger = new Logger(BookCommandService.name);

  constructor(
    private readonly eventStore: EventStoreService,
    private readonly snapshotService: SnapshotService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  private async rehydrate(
    aggregateId: string,
    revision?: number,
  ): Promise<BookAggregate> {
    const aggregate = new BookAggregate(aggregateId);

    const snapshot = await this.snapshotService.getLatestSnapshotOnRevision(
      aggregateId,
      revision,
    );

    const events = await this.eventStore.getEventsByAggregateIdAfterRevision(
      aggregateId,
      snapshot?.revision ?? 0,
      revision,
    );

    if (events.length === 0 && !snapshot) {
      throw new NotFoundException('Book not found');
    }

    if (snapshot) {
      aggregate.loadFromSnapshot(
        snapshot.state as BookState,
        snapshot.revision,
      );
    }

    for (const event of events) {
      aggregate.apply(event);
    }
    return aggregate;
  }

  private async recordAndApply(bookEvent: BookEvent) {
    const count = await this.eventStore.getCountByAggregateId(bookEvent.bookId);

    const event: Prisma.EventCreateInput = {
      aggregateId: bookEvent.bookId,
      aggregateRevision: count + 1,
      type: bookEvent.type,
      data: bookEvent.data,
    };

    await this.eventStore.appendEvent(event);
    this.emitEvent(event);

    if ((count + 1) % SNAPSHOT_THRESHOLD === 0) {
      const aggregate = await this.rehydrate(bookEvent.bookId);
      const state = aggregate.getState();
      await this.snapshotService.saveSnapshot(
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
    const aggregate = await this.rehydrate(bookId);
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
    const aggregate = await this.rehydrate(bookId);
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
    const aggregate = await this.rehydrate(bookId);
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
    const aggregate = await this.rehydrate(bookId);
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

  async getBookState(bookId: string, revision?: number) {
    const aggregate = await this.rehydrate(bookId, revision);
    return aggregate.getState();
  }

  async replayEvents(bookId: string, revision?: number) {
    const events = await this.eventStore.getEventsByAggregateId(
      bookId,
      revision,
    );

    for (const event of events) {
      this.emitEvent(event);
    }
  }

  private emitEvent(event: Event | Prisma.EventCreateInput) {
    this.logger.log('Emit event: ' + event.type);
    this.eventEmitter.emit(event.type, event);
  }
}
