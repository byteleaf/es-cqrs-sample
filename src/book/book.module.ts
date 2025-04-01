import { Module } from '@nestjs/common';
import { BookQueryModule } from './book-query/book-query.module';
import { BookCommandModule } from './book-command/book-command.module';

@Module({
  imports: [BookCommandModule, BookQueryModule],
})
export class BookModule {}
