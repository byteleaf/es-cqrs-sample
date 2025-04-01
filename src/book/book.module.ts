import { Module } from '@nestjs/common';
import { BookCommandModule } from './book-command/book-command.module';
import { BookQueryModule } from './book-query/book-query.module';
import { BookProjectorService } from './book-projector.service';

@Module({
  imports: [BookCommandModule, BookQueryModule],
  providers: [BookProjectorService],
})
export class BookModule {}
