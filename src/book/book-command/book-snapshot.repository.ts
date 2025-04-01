import {
  type ISnapshot,
  Snapshot,
  SnapshotRepository,
} from '@ocoda/event-sourcing';
import { BookAggregate, BookId } from './aggregates/book.aggregate';

@Snapshot(BookAggregate, { name: 'book', interval: 3 })
export class BookSnapshotRepository extends SnapshotRepository<BookAggregate> {
  serialize({
    id,
    title,
    author,
    isbn,
    status,
    readerId,
    revision,
  }: BookAggregate): ISnapshot<BookAggregate> {
    return {
      id: id.value,
      title: title,
      author: author,
      isbn: isbn,
      status: status,
      readerId: readerId,
      revision: revision,
    };
  }

  deserialize({
    id,
    title,
    author,
    isbn,
    status,
    readerId,
    revision,
  }: ISnapshot<BookAggregate>): BookAggregate {
    const bookAggregate = new BookAggregate();
    bookAggregate.id = BookId.from(id);
    bookAggregate.title = title;
    bookAggregate.author = author;
    bookAggregate.isbn = isbn;
    bookAggregate.status = status;
    bookAggregate.readerId = readerId;
    bookAggregate.revision = revision;

    return bookAggregate;
  }
}
