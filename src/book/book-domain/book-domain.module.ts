import { Module } from '@nestjs/common';
import { EventSourcingModule } from '../../event-sourcing/event-sourcing.module';
import { BookRepository } from './book.repository';
import { BookSnapshotRepository } from './book-snapshot.repository';

@Module({
  imports: [EventSourcingModule],
  providers: [BookRepository, BookSnapshotRepository],
  exports: [BookRepository, BookSnapshotRepository],
})
export class BookDomainModule {}
