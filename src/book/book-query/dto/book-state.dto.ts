import { BookStatus } from '@prisma/client';
import { BookAggregate } from '../../book-domain/aggregates/book.aggregate';

export class BookState {
  bookId: string;
  title: string;
  author: string;
  isbn: string;
  status: BookStatus;
  readerId: string | null;
  revision: number;

  static from(bookAggregate: BookAggregate): BookState {
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
