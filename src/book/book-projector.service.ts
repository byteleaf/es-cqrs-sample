import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookStatus } from '@prisma/client';
import { EventHandler } from '@ocoda/event-sourcing';
import { BookRegisteredEvent } from './events/book-registered.event';
import { BookBorrowedEvent } from './events/book-borrowed.event';
import { BookReturnedEvent } from './events/book-returned.event';
import { Condition } from './enums/condition.enum';
import { BookDamagedEvent } from './events/book-damaged.event';
import { BookRepairedEvent } from './events/book-repaired.event';
import { BookRemovedEvent } from './events/book-removed.event';

@Injectable()
export class BookProjectorService {
  private readonly logger = new Logger(BookProjectorService.name);

  constructor(private prismaService: PrismaService) {}

  @EventHandler(BookRegisteredEvent)
  async onBookRegisteredEvent(event: BookRegisteredEvent) {
    this.logger.log(`Received BookRegisteredEvent: ${event.bookId}`);

    await this.prismaService.book.upsert({
      where: { bookId: event.bookId },
      create: {
        bookId: event.bookId,
        title: event.title,
        author: event.author,
        isbn: event.isbn,
        status: BookStatus.AVAILABLE,
      },
      update: {
        title: event.title,
        author: event.author,
        isbn: event.isbn,
        status: BookStatus.AVAILABLE,
      },
    });
  }

  @EventHandler(BookBorrowedEvent)
  async onBookBorrowedEvent(event: BookBorrowedEvent) {
    this.logger.log(`Received BookBorrowedEvent: ${event.bookId}`);

    await this.prismaService.book.update({
      where: { bookId: event.bookId },
      data: { status: BookStatus.BORROWED },
    });
  }

  @EventHandler(BookReturnedEvent)
  async onBookReturnedEvent(event: BookReturnedEvent) {
    this.logger.log(`Received BookReturnedEvent: ${event.bookId}`);

    await this.prismaService.book.update({
      where: { bookId: event.bookId },
      data: {
        status:
          event.condition === Condition.Good
            ? BookStatus.AVAILABLE
            : BookStatus.DAMAGED,
      },
    });
  }

  @EventHandler(BookDamagedEvent)
  async onBookDamagedEvent(event: BookDamagedEvent) {
    this.logger.log(`Received BookDamagedEvent: ${event.bookId}`);

    await this.prismaService.book.update({
      where: { bookId: event.bookId },
      data: { status: BookStatus.DAMAGED },
    });
  }

  @EventHandler(BookRepairedEvent)
  async onBookRepairedEvent(event: BookRepairedEvent) {
    this.logger.log(`Received BookRepairedEvent: ${event.bookId}`);

    await this.prismaService.book.update({
      where: { bookId: event.bookId },
      data: { status: BookStatus.AVAILABLE },
    });
  }

  @EventHandler(BookRemovedEvent)
  async onBookRemovedEvent(event: BookRemovedEvent) {
    this.logger.log(`Received BookRemovedEvent: ${event.bookId}`);

    await this.prismaService.book.update({
      where: { bookId: event.bookId },
      data: { status: BookStatus.REMOVED },
    });
  }
}
