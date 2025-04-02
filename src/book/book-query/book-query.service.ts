import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Book } from './dto/book.dto';
import { BookEventRehydrationService } from '../book-domain/book-event-rehydration.service';
import { BookState } from './dto/book-state.dto';

@Injectable()
export class BookQueryService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly bookEventRehydrationService: BookEventRehydrationService,
  ) {}

  async queryBook(id: string) {
    const book = await this.prismaService.book.findUnique({
      where: { bookId: id },
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }
    return Book.from(book);
  }

  async queryBookState(id: string, revision: number): Promise<BookState> {
    const bookAggregate = await this.bookEventRehydrationService.rehydrate(
      id,
      revision,
    );

    return BookState.from(bookAggregate);
  }
}
