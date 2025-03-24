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
        const { title, author } = data;
        await this.prisma.book.create({
          data: {
            id: bookId,
            title: title,
            author: author,
            isbn: data.isbn,
            status: BookStatus.AVAILABLE,
          },
        });
        break;
      case 'BookBorrowed':
        await this.prisma.book.update({
          where: { id: bookId },
          data: { status: BookStatus.BORROWED },
        });
        break;
      case 'BookReturned':
        const { condition } = data;
        await this.prisma.book.update({
          where: { id: bookId },
          data: {
            status:
              condition === 'good' ? BookStatus.AVAILABLE : BookStatus.DAMAGED,
          },
        });
        break;
      case 'BookRepaired':
        await this.prisma.book.update({
          where: { id: bookId },
          data: { status: BookStatus.REPAIRED },
        });
        break;
      case 'BookRemoved':
        await this.prisma.book.update({
          where: { id: bookId },
          data: { status: BookStatus.REMOVED },
        });
        break;
    }
  }
}
