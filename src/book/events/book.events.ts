import { Condition } from '../types/condition.type';

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
      type: 'BookRepaired';
      data: { comment: string };
    })
  | (BaseBookEvent & {
      type: 'BookRemoved';
      data: { reason: string };
    });
