import { Event, type IEvent } from '@ocoda/event-sourcing';

@Event('book-registered')
export class BookRegisteredEvent implements IEvent {
  constructor(
    public readonly bookId: string,
    public readonly title: string,
    public readonly author: string,
    public readonly isbn: string,
  ) {}
}
