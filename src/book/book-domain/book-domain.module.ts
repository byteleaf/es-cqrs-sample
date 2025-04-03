import { Module } from '@nestjs/common';
import { EventSourcingModule } from '../../event-sourcing/event-sourcing.module';
import { BookEventRehydrationService } from './book-event-rehydration.service';

@Module({
  imports: [EventSourcingModule],
  providers: [BookEventRehydrationService],
  exports: [BookEventRehydrationService],
})
export class BookDomainModule {}
