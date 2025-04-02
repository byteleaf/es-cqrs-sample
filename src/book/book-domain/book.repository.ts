import { Injectable } from '@nestjs/common';
import { EventStore, EventStream, Id } from '@ocoda/event-sourcing';
import { BookAggregate } from '../book-command/aggregates/book.aggregate';
import { BookSnapshotRepository } from './book-snapshot.repository';

@Injectable()
export class BookRepository {
  constructor(
    private readonly eventStore: EventStore,
    private readonly bookSnapshotRepository: BookSnapshotRepository,
  ) {}

  async getById(bookId: Id, revision?: number): Promise<BookAggregate> {
    const eventStream = EventStream.for<BookAggregate>(BookAggregate, bookId);

    const bookAggregate = await this.getLatestSnapshot(bookId, revision);

    const eventCursor = this.eventStore.getEvents(eventStream, {
      fromVersion: bookAggregate.version + 1,
      limit: revision - bookAggregate.version,
    });

    await bookAggregate.loadFromHistory(eventCursor);

    if (bookAggregate.version < 1) {
      return;
    }

    return bookAggregate;
  }

  private async getLatestSnapshot(
    bookId: Id,
    revision?: number,
  ): Promise<BookAggregate> {
    const snapshots = this.bookSnapshotRepository.loadAll({
      aggregateId: bookId,
    });
    let bookAggregate = new BookAggregate();

    for await (const envelopes of snapshots) {
      for (const { payload, metadata } of envelopes) {
        if (
          metadata.aggregateId === bookId.value && // WORKAROUND: There may be an bug in the loadAll method because it does not filter by aggregateId.
          metadata.version < revision
        ) {
          bookAggregate = this.bookSnapshotRepository.deserialize(payload);
          bookAggregate.version = metadata.version;
        }
      }
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
