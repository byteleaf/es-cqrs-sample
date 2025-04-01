import { BookAggregate } from '../aggregates/book.aggregate';

export class Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  status: string;
  readerId: string | null;
  revision: number;

  static from(bookAggregate: BookAggregate): Book {
    return {
      id: bookAggregate.id.value,
      title: bookAggregate.title,
      author: bookAggregate.author,
      isbn: bookAggregate.isbn,
      status: bookAggregate.status,
      readerId: bookAggregate.readerId,
      revision: bookAggregate.revision,
    };
  }
}
