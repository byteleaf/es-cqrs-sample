import { Module } from '@nestjs/common';
import { BookQueryService } from './book-query.service';
import { BookQueryController } from './book-query.controller';
import { BookProjector } from './book.projector';

@Module({
  providers: [BookQueryService, BookProjector],
  controllers: [BookQueryController],
})
export class BookQueryModule {}
