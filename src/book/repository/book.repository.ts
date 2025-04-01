import { Injectable } from '@nestjs/common';
import { EventStore, EventStream, Id } from '@ocoda/event-sourcing';
import { BookAggregate } from '../aggregates/book.aggregate';
import { BookSnapshotRepository } from './book-snapshot.repository';

@Injectable()
export class BookRepository {
  constructor(
    private readonly eventStore: EventStore,
    private readonly bookSnapshotRepository: BookSnapshotRepository,
  ) {}

  async getById(bookId: Id): Promise<BookAggregate> {
    const eventStream = EventStream.for<BookAggregate>(BookAggregate, bookId);

    const bookAggregate = await this.bookSnapshotRepository.load(bookId);

    const eventCursor = this.eventStore.getEvents(eventStream, {
      fromVersion: bookAggregate.version + 1,
    });

    await bookAggregate.loadFromHistory(eventCursor);

    if (bookAggregate.version < 1) {
      return;
    }

    return bookAggregate;
  }

  async save(bookAggregate: BookAggregate): Promise<void> {
    const events = bookAggregate.commit();
    const stream = EventStream.for<BookAggregate>(
      BookAggregate,
      bookAggregate.id,
    );

    await this.eventStore.appendEvents(stream, bookAggregate.version, events);
    await this.bookSnapshotRepository.save(bookAggregate.id, bookAggregate);
  }
}
