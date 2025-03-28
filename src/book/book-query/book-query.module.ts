import { Module } from '@nestjs/common';
import { BookQueryService } from './book-query.service';
import { BookQueryController } from './book-query.controller';

@Module({
  providers: [BookQueryService],
  controllers: [BookQueryController],
})
export class BookQueryModule {}
