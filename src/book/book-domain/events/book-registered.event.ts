import { Event, type IEvent } from '@ocoda/event-sourcing';
import { BookEventTypes } from '../enums/book-event-types.enum';

@Event(BookEventTypes.BookRegistered)
export class BookRegisteredEvent implements IEvent {
  constructor(
    public readonly bookId: string,
    public readonly title: string,
    public readonly author: string,
    public readonly isbn: string,
  ) {}
}
