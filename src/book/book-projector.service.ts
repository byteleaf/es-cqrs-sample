import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookEvent } from './events/book.events';

@Injectable()
export class BookProjectorService {
  constructor(private prisma: PrismaService) {}

  async applyEvent(event: BookEvent) {
    const { type, bookId, data } = event;

    switch (type) {
      case 'BookRegistered':
        const { title, author } = data as { title: string; author: string }; // TODO: type guard
        await this.prisma.book.create({
          data: {
            id: bookId,
            title: title,
            author: author,
            status: 'available',
          },
        });
        break;
      case 'BookBorrowed':
        await this.prisma.book.update({
          where: { id: bookId },
          data: { status: 'borrowed' },
        });
        break;
      case 'BookReturned':
        await this.prisma.book.update({
          where: { id: bookId },
          data: { status: 'available' },
        });
        break;
      case 'BookRepaired':
        await this.prisma.book.update({
          where: { id: bookId },
          data: { status: 'repaired' },
        });
        break;
      case 'BookRemoved':
        await this.prisma.book.update({
          where: { id: bookId },
          data: { status: 'removed' },
        });
        break;
    }
  }
}
