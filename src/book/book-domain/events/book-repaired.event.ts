import { Event, type IEvent } from '@ocoda/event-sourcing';
import { BookEventTypes } from '../enums/book-event-types.enum';

@Event(BookEventTypes.BookRepaired)
export class BookRepairedEvent implements IEvent {
  constructor(
    public readonly bookId: string,
    public readonly comment: string,
  ) {}
}
