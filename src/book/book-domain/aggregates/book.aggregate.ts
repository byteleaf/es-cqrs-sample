import { BookStatus, Event, Prisma } from '@prisma/client';
import { BookEventTypes } from '../enums/book-event-types.enum';
import { Condition } from '../enums/condition.enum';

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

  loadFromSnapshot(state: BookState, revision: number) {
    this.state = { ...state, revision };
  }

  apply(event: Event) {
    switch (event.type) {
      case BookEventTypes.BookRegistered:
        this.state = {
          ...this.state,
          ...(event.data as Prisma.JsonObject),
          status: BookStatus.AVAILABLE,
        };
        break;
      case BookEventTypes.BookBorrowed:
        const { readerId } = event.data as { readerId: string };
        this.state = {
          ...this.state,
          status: BookStatus.BORROWED,
          readerId: readerId,
        };
        break;
      case BookEventTypes.BookReturned:
        this.state = {
          ...this.state,
          status:
            (event.data as Prisma.JsonObject).condition === Condition.Good
              ? BookStatus.AVAILABLE
              : BookStatus.DAMAGED,
          readerId: null,
        };
        break;
      case BookEventTypes.BookRepaired:
        this.state = {
          ...this.state,
          status: BookStatus.AVAILABLE,
        };
        break;
      case BookEventTypes.BookRemoved:
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
