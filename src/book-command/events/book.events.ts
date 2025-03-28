import { Condition } from '../enums/condition.enum';
import { BookEventTypes } from '../../common/enums/book-event-types.enum';

type BaseBookEvent = {
  bookId: string;
};

export type BookEvent =
  | (BaseBookEvent & {
      type: BookEventTypes.BookRegistered;
      data: { title: string; author: string; isbn: string };
    })
  | (BaseBookEvent & {
      type: BookEventTypes.BookBorrowed;
      bookId: string;
      data: { readerId: string };
    })
  | (BaseBookEvent & {
      type: BookEventTypes.BookReturned;
      data: { condition: Condition };
    })
  | (BaseBookEvent & {
      type: BookEventTypes.BookDamaged;
      data: { comment: string };
    })
  | (BaseBookEvent & {
      type: BookEventTypes.BookRepaired;
      data: { comment: string };
    })
  | (BaseBookEvent & {
      type: BookEventTypes.BookRemoved;
      data: { reason: string };
    });
