import { BookStatus } from '@prisma/client';
import { BookAggregate } from '../../book-command/aggregates/book.aggregate';

export class BookState {
  bookId: string;
  title: string;
  author: string;
  isbn: string;
  status: BookStatus;
  readerId: string | null;
  revision: number;

  static from(book: BookAggregate): BookState {
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
