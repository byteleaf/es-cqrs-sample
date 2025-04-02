import { BookAggregate } from '../../book-domain/aggregates/book.aggregate';
import { Book } from './book.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BookState extends Book {
  @ApiPropertyOptional({ example: 'reader-123' })
  readerId: string | null;

  @ApiProperty({ example: 1 })
  revision: number;

  static fromAggregate(bookAggregate: BookAggregate): BookState {
    const book = bookAggregate.getState();

    return {
      bookId: book.id,
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      status: book.status,
      readerId: book.readerId,
      revision: book.revision,
    };
  }
}
