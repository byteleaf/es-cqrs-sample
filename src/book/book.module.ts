import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { BookProjectorService } from './book-projector.service';

@Module({
  controllers: [BookController],
  providers: [BookService, BookProjectorService],
})
export class BookModule {}
