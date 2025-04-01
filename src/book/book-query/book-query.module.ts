import { Module } from '@nestjs/common';
import { BookQueryController } from './book-query.controller';
import { GetBookByIdQueryHandler } from './queries/get-book.query';
import { BookProjector } from './book.projector';

@Module({
  providers: [GetBookByIdQueryHandler, BookProjector],
  controllers: [BookQueryController],
})
export class BookQueryModule {}
