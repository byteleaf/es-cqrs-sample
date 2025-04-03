import { BookAggregate } from '../../book-command/aggregates/book.aggregate';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Book } from './book.dto';

export class BookState extends Book {
  @ApiPropertyOptional({ example: 'reader-123' })
  readerId: string | null;

  @ApiProperty({ example: 1 })
  revision: number;

  static fromAggregate(book: BookAggregate): BookState {
    return {
      bookId: book.id.value,
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      status: book.status,
      readerId: book.readerId,
      revision: book.revision,
    };
  }
}
