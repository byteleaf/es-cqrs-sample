import { Event, type IEvent } from '@ocoda/event-sourcing';

@Event('book-removed')
export class BookRemovedEvent implements IEvent {
  constructor(
    public readonly bookId: string,
    public readonly reason: string,
  ) {}
}
