import { Event, type IEvent } from '@ocoda/event-sourcing';
import { BookEventTypes } from '../enums/book-event-types.enum';

@Event(BookEventTypes.BookRemoved)
export class BookRemovedEvent implements IEvent {
  constructor(
    public readonly bookId: string,
    public readonly reason: string,
  ) {}
}
