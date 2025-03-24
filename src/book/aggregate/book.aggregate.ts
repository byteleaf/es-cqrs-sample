import { BookEvent } from '../events/book.events';

export type BookState = {
  id: string;
  title?: string;
  author?: string;
  isbn?: string;
  status?: 'available' | 'borrowed' | 'repair' | 'removed';
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
          status: 'available',
        };
        break;
      case 'BookBorrowed':
        this.state = {
          ...this.state,
          status: 'borrowed',
          readerId: event.data.readerId,
        };
        break;
      case 'BookReturned':
        this.state = {
          ...this.state,
          status: event.data.condition === 'good' ? 'available' : 'repair',
          readerId: null,
        };
        break;
      case 'BookRepaired':
        this.state = {
          ...this.state,
          status: 'available',
        };
        break;
      case 'BookRemoved':
        this.state = {
          ...this.state,
          status: 'removed',
        };
        break;
    }
    this.state.revision += 1;
  }

  getState() {
    return this.state;
  }
}
