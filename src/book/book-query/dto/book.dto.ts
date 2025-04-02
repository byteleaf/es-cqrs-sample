import { Book as BookEntity } from '@prisma/client';

export class Book {
  bookId: string;
  title: string;
  author: string;
  isbn: string;
  status: string;

  static from(book: BookEntity): Book {
    return {
      bookId: book.bookId,
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      status: book.status,
    };
  }
}
