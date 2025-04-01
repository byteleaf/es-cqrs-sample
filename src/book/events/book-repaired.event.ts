import { Event, type IEvent } from '@ocoda/event-sourcing';

@Event('book-repaired')
export class BookRepairedEvent implements IEvent {
  constructor(
    public readonly bookId: string,
    public readonly comment: string,
  ) {}
}
