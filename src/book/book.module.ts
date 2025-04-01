import { Module } from '@nestjs/common';
import { BookCommandModule } from './book-command/book-command.module';
import { BookQueryModule } from './book-query/book-query.module';

@Module({
  imports: [BookCommandModule, BookQueryModule],
})
export class BookModule {}
