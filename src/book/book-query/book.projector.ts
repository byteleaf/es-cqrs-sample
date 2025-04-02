import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BookStatus, Event, Prisma } from '@prisma/client';
import { OnEvent } from '@nestjs/event-emitter';
import { BookEventTypes } from '../book-domain/enums/book-event-types.enum';

@Injectable()
export class BookProjector {
  private readonly logger = new Logger(BookProjector.name);

  constructor(private prismaService: PrismaService) {}

  @OnEvent('book.*')
  async handleOrderCreatedEvent(event: Event | Prisma.EventCreateInput) {
    this.logger.log(`Received event: ${event.type}`);
    await this.applyEvent(event);
  }

  async applyEvent(event: Event | Prisma.EventCreateInput) {
    const { type, aggregateId: bookId, data } = event;

    switch (type) {
      case BookEventTypes.BookRegistered:
        const { title, author, isbn } = data as {
          title: string;
          author: string;
          isbn: string;
        }; // TODO: fix type
        await this.prismaService.book.upsert({
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
      case BookEventTypes.BookBorrowed:
        await this.prismaService.book.update({
          where: { bookId },
          data: { status: BookStatus.BORROWED },
        });
        break;
      case BookEventTypes.BookReturned:
        const { condition } = data as Prisma.JsonObject;
        await this.prismaService.book.update({
          where: { bookId },
          data: {
            status:
              condition === 'good' ? BookStatus.AVAILABLE : BookStatus.DAMAGED,
          },
        });
        break;
      case BookEventTypes.BookDamaged:
        await this.prismaService.book.update({
          where: { bookId },
          data: { status: BookStatus.DAMAGED },
        });
        break;
      case BookEventTypes.BookRepaired:
        await this.prismaService.book.update({
          where: { bookId },
          data: { status: BookStatus.AVAILABLE },
        });
        break;
      case BookEventTypes.BookRemoved:
        await this.prismaService.book.update({
          where: { bookId },
          data: { status: BookStatus.REMOVED },
        });
        break;
    }
  }
}
