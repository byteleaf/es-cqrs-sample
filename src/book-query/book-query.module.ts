import { Module } from '@nestjs/common';
import { BookQueryService } from './book-query.service';
import { BookQueryController } from './book-query.controller';
import { BookProjectorService } from './book-projector.service';

@Module({
  providers: [BookQueryService, BookProjectorService],
  controllers: [BookQueryController],
})
export class BookQueryModule {}
