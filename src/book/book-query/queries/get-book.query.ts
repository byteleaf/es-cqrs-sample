import {
  type IQuery,
  type IQueryHandler,
  QueryHandler,
} from '@ocoda/event-sourcing';
import { NotFoundException } from '@nestjs/common';
import { Book } from '../dto/book.dto';
import { PrismaService } from '../../../prisma/prisma.service';

export class GetBookByIdQuery implements IQuery {
  constructor(public readonly bookId: string) {}
}

@QueryHandler(GetBookByIdQuery)
export class GetBookByIdQueryHandler
  implements IQueryHandler<GetBookByIdQuery, Book>
{
  constructor(private readonly prismaService: PrismaService) {}

  public async execute(query: GetBookByIdQuery): Promise<Book> {
    const book = await this.prismaService.book.findUnique({
      where: { bookId: query.bookId },
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }
    return Book.fromEntity(book);
  }
}
