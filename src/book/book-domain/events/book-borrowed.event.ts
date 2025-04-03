import { Event, type IEvent } from '@ocoda/event-sourcing';
import { BookEventTypes } from '../enums/book-event-types.enum';

@Event(BookEventTypes.BookBorrowed)
export class BookBorrowedEvent implements IEvent {
  constructor(
    public readonly bookId: string,
    public readonly readerId: string,
  ) {}
}
