import { Module } from '@nestjs/common';
import { BookRepository } from './book.repository';
import { BookSnapshotRepository } from './book-snapshot.repository';
import { EventSourcingModule } from '../event-sourcing/event-sourcing.module';

@Module({
  imports: [EventSourcingModule],
  providers: [BookRepository, BookSnapshotRepository],
  exports: [BookRepository, BookSnapshotRepository],
})
export class BookRepositoryModule {}
