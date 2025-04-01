import { Event, type IEvent } from '@ocoda/event-sourcing';

@Event('book-borrowed')
export class BookBorrowedEvent implements IEvent {
  constructor(
    public readonly bookId: string,
    public readonly readerId: string,
  ) {}
}
