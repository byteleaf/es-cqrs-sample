import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookEvent } from './events/book.events';
import { BookStatus } from '@prisma/client';

@Injectable()
export class BookProjectorService {
  constructor(private prisma: PrismaService) {}

  async applyEvent(event: BookEvent) {
    const { type, bookId, data } = event;

    switch (type) {
      case 'BookRegistered':
        const { title, author, isbn } = data;
        await this.prisma.book.upsert({
          where: { bookId: bookId },
          create: {
            bookId,
            title,
            author,
            isbn,
            status: BookStatus.AVAILABLE,
          },
          update: {
            title,
            author,
            isbn,
            status: BookStatus.AVAILABLE,
          },
        });
        break;
      case 'BookBorrowed':
        await this.prisma.book.update({
          where: { bookId },
          data: { status: BookStatus.BORROWED },
        });
        break;
      case 'BookReturned':
        const { condition } = data;
        await this.prisma.book.update({
          where: { bookId },
          data: {
            status:
              condition === 'good' ? BookStatus.AVAILABLE : BookStatus.DAMAGED,
          },
        });
        break;
      case 'BookRepaired':
        await this.prisma.book.update({
          where: { bookId },
          data: { status: BookStatus.REPAIRED },
        });
        break;
      case 'BookRemoved':
        await this.prisma.book.update({
          where: { bookId },
          data: { status: BookStatus.REMOVED },
        });
        break;
    }
  }
}
