import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { BookProjectorService } from './book-projector.service';
import { EventStoreModule } from '../event-store/event-store.module';

@Module({
  imports: [EventStoreModule],
  controllers: [BookController],
  providers: [BookService, BookProjectorService],
})
export class BookModule {}
