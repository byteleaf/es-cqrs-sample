import { Event, type IEvent } from '@ocoda/event-sourcing';
import { Condition } from '../enums/condition.enum';
import { BookEventTypes } from '../enums/book-event-types.enum';

@Event(BookEventTypes.BookReturned)
export class BookReturnedEvent implements IEvent {
  constructor(
    public readonly bookId: string,
    public readonly condition: Condition,
  ) {}
}
