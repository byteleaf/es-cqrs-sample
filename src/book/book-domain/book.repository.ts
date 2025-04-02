import { Injectable } from '@nestjs/common';
import {
  EventStore,
  EventStream,
  Id,
  type ISnapshot,
} from '@ocoda/event-sourcing';
import { BookAggregate } from '../book-command/aggregates/book.aggregate';
import { BookSnapshotRepository } from './book-snapshot.repository';

@Injectable()
export class BookRepository {
  constructor(
    private readonly eventStore: EventStore,
    private readonly bookSnapshotRepository: BookSnapshotRepository,
  ) {}

  async getById(
    bookId: Id,
    revision: number = Number.MAX_SAFE_INTEGER,
  ): Promise<BookAggregate> {
    const eventStream = EventStream.for<BookAggregate>(BookAggregate, bookId);

    const snapshots = this.bookSnapshotRepository.loadAll({
      aggregateId: bookId,
      limit: revision,
    });

    const result = await snapshots.next();
    if (result.done || !result.value?.length) {
      return;
    }

    const payload = result.value[0].payload as ISnapshot<BookAggregate>;
    const bookAggregate = this.bookSnapshotRepository.deserialize(payload);

    const eventCursor = this.eventStore.getEvents(eventStream, {
      fromVersion: bookAggregate.version + 1,
      limit: revision,
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
