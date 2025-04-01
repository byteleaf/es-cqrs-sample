import {
  Aggregate,
  AggregateRoot,
  EventHandler,
  UUID,
} from '@ocoda/event-sourcing';
import { BookRegisteredEvent } from '../../events/book-registered.event';
import { BookBorrowedEvent } from '../../events/book-borrowed.event';
import { BookReturnedEvent } from '../../events/book-returned.event';
import { Condition } from '../../enums/condition.enum';
import { BookDamagedEvent } from '../../events/book-damaged.event';
import { BookRepairedEvent } from '../../events/book-repaired.event';
import { BookRemovedEvent } from '../../events/book-removed.event';
import { BookStatus } from '@prisma/client';

export class BookId extends UUID {}

@Aggregate({ streamName: 'book' })
export class BookAggregate extends AggregateRoot {
  id: BookId;
  title: string;
  author: string;
  isbn: string;
  status: BookStatus;
  readerId: string | null;
  revision: number;

  public static registerBook(
    bookId: BookId,
    title: string,
    author: string,
    isbn: string,
  ) {
    const book = new BookAggregate();
    book.applyEvent(new BookRegisteredEvent(bookId.value, title, author, isbn));
    return book;
  }

  public borrowBook(bookId: BookId, readerId: string) {
    this.applyEvent(new BookBorrowedEvent(bookId.value, readerId));
  }

  public returnBook(bookId: BookId, condition: Condition) {
    this.applyEvent(new BookReturnedEvent(bookId.value, condition));
  }

  public markAsDamaged(bookId: BookId, comment: string) {
    this.applyEvent(new BookDamagedEvent(bookId.value, comment));
  }

  public repairBook(bookId: BookId, comment: string) {
    this.applyEvent(new BookRepairedEvent(bookId.value, comment));
  }

  public removeBook(bookId: BookId, reason: string) {
    this.applyEvent(new BookRemovedEvent(bookId.value, reason));
  }

  @EventHandler(BookRegisteredEvent)
  onBookRegisteredEvent(event: BookRegisteredEvent) {
    this.id = BookId.from(event.bookId);
    this.title = event.title;
    this.author = event.author;
    this.isbn = event.isbn;
    this.status = BookStatus.AVAILABLE;
    this.revision = 1;
  }

  @EventHandler(BookBorrowedEvent)
  onBookBorrowedEvent(event: BookBorrowedEvent) {
    this.status = BookStatus.BORROWED;
    this.readerId = event.readerId;
    this.revision++;
  }

  @EventHandler(BookReturnedEvent)
  onBookReturnedEvent(event: BookReturnedEvent) {
    this.status =
      event.condition === Condition.Good
        ? BookStatus.AVAILABLE
        : BookStatus.DAMAGED;
    this.readerId = null;
    this.revision++;
  }

  @EventHandler(BookDamagedEvent)
  onBookDamagedEvent() {
    this.status = BookStatus.DAMAGED;
    this.revision++;
  }

  @EventHandler(BookRepairedEvent)
  onBookRepairedEvent() {
    this.status = BookStatus.AVAILABLE;
    this.revision++;
  }

  @EventHandler(BookRemovedEvent)
  onBookRemovedEvent() {
    this.status = BookStatus.REMOVED;
    this.revision++;
  }
}
