import { Event, type IEvent } from '@ocoda/event-sourcing';
import { Condition } from '../enums/condition.enum';

@Event('book-returned')
export class BookReturnedEvent implements IEvent {
  constructor(
    public readonly bookId: string,
    public readonly condition: Condition,
  ) {}
}
