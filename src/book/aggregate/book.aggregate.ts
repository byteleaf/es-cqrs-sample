import { BookEvent } from '../events/book.events';
import { BookStatus } from '@prisma/client';

export type BookState = {
  id: string;
  title?: string;
  author?: string;
  isbn?: string;
  status?: BookStatus;
  readerId?: string | null;
  revision: number;
};

export class BookAggregate {
  private state: BookState;

  constructor(private readonly aggregateId: string) {
    this.state = { id: aggregateId, revision: 0 };
  }

  apply(event: BookEvent) {
    switch (event.type) {
      case 'BookRegistered':
        this.state = {
          ...this.state,
          ...event.data,
          status: BookStatus.AVAILABLE,
        };
        break;
      case 'BookBorrowed':
        this.state = {
          ...this.state,
          status: BookStatus.BORROWED,
          readerId: event.data.readerId,
        };
        break;
      case 'BookReturned':
        this.state = {
          ...this.state,
          status:
            event.data.condition === 'good'
              ? BookStatus.AVAILABLE
              : BookStatus.DAMAGED,
          readerId: null,
        };
        break;
      case 'BookRepaired':
        this.state = {
          ...this.state,
          status: BookStatus.AVAILABLE,
        };
        break;
      case 'BookRemoved':
        this.state = {
          ...this.state,
          status: BookStatus.REMOVED,
        };
        break;
    }
    this.state.revision += 1;
  }

  getState() {
    return this.state;
  }
}
