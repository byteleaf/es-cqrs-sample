type BaseBookEvent = {
  bookId: string;
};

export type Condition = 'good' | 'bad';

export type BookEvent =
  | {
      type: 'BookRegistered';
      data: { title: string; author: string; isbn: string };
    }
  | (BaseBookEvent & {
      type: 'BookBorrowed';
      bookId: string;
      data: { readerId: string };
    })
  | (BaseBookEvent & {
      type: 'BookReturned';
      data: { condition: Condition };
    })
  | (BaseBookEvent & {
      type: 'BookRepaired';
      data: { comment: string };
    })
  | (BaseBookEvent & {
      type: 'BookRemoved';
      data: { comment: string };
    });
