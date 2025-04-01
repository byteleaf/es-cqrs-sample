import { Module } from '@nestjs/common';
import { BookQueryController } from './book-query.controller';
import { GetBookByIdQueryHandler } from './queries/get-book.query';

@Module({
  providers: [GetBookByIdQueryHandler],
  controllers: [BookQueryController],
})
export class BookQueryModule {}
