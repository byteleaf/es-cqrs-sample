import {
  type IQuery,
  type IQueryHandler,
  QueryHandler,
} from '@ocoda/event-sourcing';
import { NotFoundException } from '@nestjs/common';
import { BookRepository } from '../../book-domain/book.repository';
import { BookId } from '../../book-command/aggregates/book.aggregate';
import { BookState } from '../dto/book-state.dto';

export class GetBookStateByIdQuery implements IQuery {
  constructor(public readonly bookId: string) {}
}

@QueryHandler(GetBookStateByIdQuery)
export class GetBookStateByIdQueryHandler
  implements IQueryHandler<GetBookStateByIdQuery, BookState>
{
  constructor(private readonly bookRepository: BookRepository) {}

  public async execute(query: GetBookStateByIdQuery): Promise<BookState> {
    const bookId = BookId.from(query.bookId);
    const book = await this.bookRepository.getById(bookId);

    if (!book) {
      throw new NotFoundException('Book not found');
    }
    return BookState.fromAggregate(book);
  }
}
