import { Module } from '@nestjs/common';
import { BookRepository } from './book.repository';
import { BookSnapshotRepository } from './book-snapshot.repository';

@Module({
  providers: [BookRepository, BookSnapshotRepository],
  exports: [BookRepository, BookSnapshotRepository],
})
export class BookRepositoryModule {}
