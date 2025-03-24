import { Module } from '@nestjs/common';
import { EventStoreService } from './event-store.service';

@Module({
  providers: [EventStoreService],
  exports: [EventStoreService],
})
export class EventStoreModule {}
