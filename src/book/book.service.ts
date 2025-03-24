import { Injectable } from '@nestjs/common';
import { EventStoreService } from '../event-store/event-store.service';
import { BookProjectorService } from './book-projector.service';
import { BookAggregate } from './aggregate/book.aggregate';
import { Prisma } from '@prisma/client';
import { BookEvent, Condition } from './events/book.events';

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
      aggregateId: 'bookId' in bookEvent ? bookEvent.bookId : null,
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
      type: 'BookRegistered',
      data: { isbn, title, author },
    };

    await this.recordAndApply(event);
  }

  async borrowBook({ id, readerId }: { id: string; readerId: string }) {
    const aggregate = await this.rehydrate(id);
    const state = aggregate.getState();
    if (state.status !== 'available') throw new Error('Book not available');

    const event: BookEvent = {
      type: 'BookBorrowed',
      bookId: id,
      data: { readerId },
    };
    await this.recordAndApply(event);
  }

  async returnBook(id: string, condition: Condition) {
    const aggregate = await this.rehydrate(id);
    const state = aggregate.getState();
    if (state.status !== 'borrowed') throw new Error('Book not borrowed');

    const event: BookEvent = {
      type: 'BookReturned',
      bookId: id,
      data: { condition },
    };
    await this.recordAndApply(event);
  }
  //
  // async repairBook(id: string, description: string) {
  //   const aggregate = await this.rehydrate(id);
  //   const state = aggregate.getState();
  //   if (state.status !== 'repair') throw new Error('Book not in repair');
  //
  //   await this.eventStore.appendEvent({
  //     aggregateId: id,
  //     type: 'BookRepaired',
  //     data: { description },
  //     aggregateRevision: state.revision,
  //     timeOccurred: new Date(),
  //   });
  // }
  //
  // async removeBook(id: string, reason: string) {
  //   const aggregate = await this.rehydrate(id);
  //   const state = aggregate.getState();
  //   if (state.status === 'removed') throw new Error('Already removed');
  //
  //   await this.eventStore.appendEvent({
  //     aggregateId: id,
  //     type: 'BookRemoved',
  //     data: { reason },
  //     aggregateRevision: state.revision,
  //     timeOccurred: new Date(),
  //   });
  // }

  // async getBookState(id: string) {
  //   const aggregate = await this.rehydrate(id);
  //   return aggregate.getState();
  // }
}
