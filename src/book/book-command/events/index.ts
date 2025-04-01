import { BookRegisteredEvent } from './book-registered.event';
import { BookBorrowedEvent } from './book-borrowed.event';
import { BookRemovedEvent } from './book-removed.event';
import { BookReturnedEvent } from './book-returned.event';
import { BookDamagedEvent } from './book-damaged.event';
import { BookRepairedEvent } from './book-repaired.event';

export const Events = [
  BookRegisteredEvent,
  BookBorrowedEvent,
  BookReturnedEvent,
  BookDamagedEvent,
  BookRepairedEvent,
  BookRemovedEvent,
];
