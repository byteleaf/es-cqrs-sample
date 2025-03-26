import { Condition } from '../enums/condition.enum';

type BaseBookEvent = {
  bookId: string;
};

export type BookEvent =
  | (BaseBookEvent & {
      type: 'BookRegistered';
      data: { title: string; author: string; isbn: string };
    })
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
      type: 'BookDamaged';
      data: { comment: string };
    })
  | (BaseBookEvent & {
      type: 'BookRepaired';
      data: { comment: string };
    })
  | (BaseBookEvent & {
      type: 'BookRemoved';
      data: { reason: string };
    });
