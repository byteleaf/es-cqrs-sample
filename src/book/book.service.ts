import { ConflictException, Injectable } from '@nestjs/common';
import { EventStoreService } from '../event-store/event-store.service';
import { BookProjectorService } from './book-projector.service';
import { BookAggregate } from './aggregate/book.aggregate';
import { BookStatus, Prisma } from '@prisma/client';
import { BookEvent } from './events/book.events';
import { Condition } from './types/condition.type';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class BookService {
  constructor(
    private readonly eventStore: EventStoreService,
    private readonly projector: BookProjectorService,
  ) {}

  private async rehydrate(aggregateId: string): Promise<BookAggregate> {
    const events =
      await this.eventStore.getEventsByAggregateId<BookEvent[]>(aggregateId);
    const aggregate = new BookAggregate(aggregateId);
    for (const event of events) {
      aggregate.apply(event);
    }
    return aggregate;
  }

  private async recordAndApply(bookEvent: BookEvent) {
    const event: Prisma.EventCreateInput = {
      aggregateId: bookEvent.bookId,
      aggregateRevision: 0,
      type: bookEvent.type,
      timeObserved: new Date(), // TODO: get from request
      timeOccurred: new Date(),
      data: bookEvent.data,
    };

    await this.eventStore.appendEvent(event);
    await this.projector.applyEvent(bookEvent);
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
      bookId: uuidv4(),
      type: 'BookRegistered',
      data: { isbn, title, author },
    };

    await this.recordAndApply(event);
    return event.bookId;
  }

  async borrowBook({ id, readerId }: { id: string; readerId: string }) {
    const aggregate = await this.rehydrate(id);
    const state = aggregate.getState();
    if (state.status !== BookStatus.AVAILABLE)
      throw new ConflictException('Book not available');

    const event: BookEvent = {
      type: 'BookBorrowed',
      bookId: id,
      data: { readerId },
    };
    await this.recordAndApply(event);
  }

  async returnBook({ id, condition }: { id: string; condition: Condition }) {
    const aggregate = await this.rehydrate(id);
    const state = aggregate.getState();
    if (state.status !== BookStatus.BORROWED)
      throw new ConflictException('Book not borrowed');

    const event: BookEvent = {
      type: 'BookReturned',
      bookId: id,
      data: { condition },
    };
    await this.recordAndApply(event);
  }

  async repairBook({ id, comment }: { id: string; comment: string }) {
    const aggregate = await this.rehydrate(id);
    const state = aggregate.getState();
    if (state.status !== BookStatus.DAMAGED)
      throw new ConflictException('Book not damaged');

    const event: BookEvent = {
      type: 'BookRepaired',
      bookId: id,
      data: { comment },
    };
    await this.recordAndApply(event);
  }

  async removeBook({ id, reason }: { id: string; reason: string }) {
    const aggregate = await this.rehydrate(id);
    const state = aggregate.getState();
    if (state.status === BookStatus.REMOVED)
      throw new ConflictException('Already removed');

    const event: BookEvent = {
      type: 'BookRemoved',
      bookId: id,
      data: { reason },
    };

    await this.recordAndApply(event);
  }

  async getBookState(id: string) {
    const aggregate = await this.rehydrate(id);
    return aggregate.getState();
  }
}
