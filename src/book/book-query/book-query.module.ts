import { Module } from '@nestjs/common';
import { BookQueryController } from './book-query.controller';
import { BookRepositoryModule } from '../book-repository/book-repository.module';
import { GetBookByIdQueryHandler } from './queries/get-book.query';

@Module({
  imports: [BookRepositoryModule],
  providers: [GetBookByIdQueryHandler],
  controllers: [BookQueryController],
})
export class BookQueryModule {}
