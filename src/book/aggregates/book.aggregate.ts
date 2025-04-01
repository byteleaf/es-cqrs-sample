import {
  Aggregate,
  AggregateRoot,
  EventHandler,
  UUID,
} from '@ocoda/event-sourcing';
import { BookRegisteredEvent } from '../events/book-registered.event';
import { BookBorrowedEvent } from '../events/book-borrowed.event';
import { BookReturnedEvent } from '../events/book-returned.event';
import { Condition } from '../enums/condition.enum';
import { BookDamagedEvent } from '../events/book-damaged.event';
import { BookRepairedEvent } from '../events/book-repaired.event';
import { BookRemovedEvent } from '../events/book-removed.event';
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

  public static registerBook(title: string, author: string, isbn: string) {
    const book = new BookAggregate();
    book.id = BookId.generate();
    book.applyEvent(new BookRegisteredEvent(title, author, isbn));
    return book;
  }

  public borrowBook(readerId: string) {
    this.applyEvent(new BookBorrowedEvent(readerId));
  }

  public returnBook(condition: Condition) {
    this.applyEvent(new BookReturnedEvent(condition));
  }

  public markAsDamaged(comment: string) {
    this.applyEvent(new BookDamagedEvent(comment));
  }

  public repairBook(comment: string) {
    this.applyEvent(new BookRepairedEvent(comment));
  }

  public removeBook(reason: string) {
    this.applyEvent(new BookRemovedEvent(reason));
  }

  @EventHandler(BookRegisteredEvent)
  onBookRegisteredEvent(event: BookRegisteredEvent) {
    this.title = event.title;
    this.author = event.author;
    this.isbn = event.isbn;
    this.status = BookStatus.AVAILABLE;
    this.revision = 0;
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
