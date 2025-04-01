import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Book } from './dto/book.dto';

@Injectable()
export class BookQueryService {
  constructor(private readonly prismaService: PrismaService) {}

  async queryBook(id: string) {
    const book = await this.prismaService.book.findUnique({
      where: { bookId: id },
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }
    return Book.from(book);
  }
}
