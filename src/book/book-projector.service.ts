import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookStatus, Event, Prisma } from '@prisma/client';

@Injectable()
export class BookProjectorService {
  constructor(private prisma: PrismaService) {}

  async applyEvent(event: Event | Prisma.EventCreateInput) {
    const { type, aggregateId: bookId, data } = event;

    switch (type) {
      case 'BookRegistered':
        const { title, author, isbn } = data as {
          title: string;
          author: string;
          isbn: string;
        }; // TODO: fix type
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
        const { condition } = data as Prisma.JsonObject;
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
