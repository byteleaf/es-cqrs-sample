import { Module } from '@nestjs/common';
import { EventStoreModule } from './event-store/event-store.module';

@Module({
  imports: [EventStoreModule],
})
export class AppModule {}
