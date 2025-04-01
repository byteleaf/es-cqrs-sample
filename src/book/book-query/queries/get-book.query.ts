import {
  type IQuery,
  type IQueryHandler,
  QueryHandler,
} from '@ocoda/event-sourcing';
import { BookRepository } from '../../shared/book.repository';
import { BookId } from '../../book-command/aggregates/book.aggregate';
import { NotFoundException } from '@nestjs/common';
import { Book } from '../dto/book.dto';

export class GetBookByIdQuery implements IQuery {
  constructor(public readonly bookId: string) {}
}

@QueryHandler(GetBookByIdQuery)
export class GetBookByIdQueryHandler
  implements IQueryHandler<GetBookByIdQuery, Book>
{
  constructor(private readonly bookRepository: BookRepository) {}

  public async execute(query: GetBookByIdQuery): Promise<Book> {
    const accountId = BookId.from(query.bookId);
    const bookAggregate = await this.bookRepository.getById(accountId);

    if (!bookAggregate) {
      throw new NotFoundException('Book not found');
    }

    return Book.from(bookAggregate);
  }
}
