import { BookStatus, Event, Prisma } from '@prisma/client';

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

  apply(event: Event) {
    switch (event.type) {
      case 'BookRegistered':
        this.state = {
          ...this.state,
          ...(event.data as Prisma.JsonObject),
          status: BookStatus.AVAILABLE,
        };
        break;
      case 'BookBorrowed':
        const { readerId } = event.data as Prisma.JsonObject;
        this.state = {
          ...this.state,
          status: BookStatus.BORROWED,
          readerId: readerId as string, //TODO: fix type
        };
        break;
      case 'BookReturned':
        this.state = {
          ...this.state,
          status:
            (event.data as Prisma.JsonObject).condition === 'good'
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
