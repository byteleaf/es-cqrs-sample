import { Event, type IEvent } from '@ocoda/event-sourcing';

@Event('book-damaged')
export class BookDamagedEvent implements IEvent {
  constructor(
    public readonly bookId: string,
    public readonly comment: string,
  ) {}
}
