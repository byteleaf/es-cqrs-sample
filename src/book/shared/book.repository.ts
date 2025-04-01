import { Injectable } from '@nestjs/common';
import { EventStore, EventStream, Id } from '@ocoda/event-sourcing';
import { BookAggregate } from '../book-command/aggregates/book.aggregate';

@Injectable()
export class BookRepository {
  constructor(private readonly eventStore: EventStore) {}

  async getById(bookId: Id): Promise<BookAggregate> {
    const eventStream = EventStream.for<BookAggregate>(BookAggregate, bookId);

    const bookAggregate = new BookAggregate();

    const eventCursor = this.eventStore.getEvents(eventStream, {
      fromVersion: bookAggregate.version + 1,
    });

    await bookAggregate.loadFromHistory(eventCursor);

    return bookAggregate;
  }

  async save(bookAggregate: BookAggregate): Promise<void> {
    const events = bookAggregate.commit();
    const stream = EventStream.for<BookAggregate>(
      BookAggregate,
      bookAggregate.id,
    );

    await this.eventStore.appendEvents(stream, bookAggregate.version, events);
  }
}
