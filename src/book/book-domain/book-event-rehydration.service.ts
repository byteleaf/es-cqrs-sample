import { BookAggregate, BookState } from './aggregates/book.aggregate';
import { Injectable, NotFoundException } from '@nestjs/common';
import { EventStoreService } from '../../event-sourcing/event-store/event-store.service';
import { SnapshotService } from '../../event-sourcing/snapshot/snapshot.service';

@Injectable()
export class BookEventRehydrationService {
  constructor(
    private readonly eventStore: EventStoreService,
    private readonly snapshotService: SnapshotService,
  ) {}

  async rehydrate(
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
      snapshot?.aggregateRevision ?? 0,
      revision,
    );

    if (events.length === 0 && !snapshot) {
      throw new NotFoundException('Book not found');
    }

    if (snapshot) {
      aggregate.loadFromSnapshot(
        snapshot.state as BookState,
        snapshot.aggregateRevision,
      );
    }

    for (const event of events) {
      aggregate.apply(event);
    }
    return aggregate;
  }
}
