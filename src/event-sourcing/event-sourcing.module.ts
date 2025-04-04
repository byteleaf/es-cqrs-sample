import { Module } from '@nestjs/common';
import { EventStoreModule } from './event-store/event-store.module';
import { SnapshotModule } from './snapshot/snapshot.module';

@Module({
  imports: [EventStoreModule, SnapshotModule],
  exports: [EventStoreModule, SnapshotModule],
})
export class EventSourcingModule {}
