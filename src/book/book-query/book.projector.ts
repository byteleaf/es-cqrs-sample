import { Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BookStatus } from '@prisma/client';
import {
  EventEnvelope,
  EventSubscriber,
  IEventSubscriber,
} from '@ocoda/event-sourcing';
import { BookRegisteredEvent } from '../book-domain/events/book-registered.event';
import { BookBorrowedEvent } from '../book-domain/events/book-borrowed.event';
import { BookDamagedEvent } from '../book-domain/events/book-damaged.event';
import { BookReturnedEvent } from '../book-domain/events/book-returned.event';
import { BookRepairedEvent } from '../book-domain/events/book-repaired.event';
import { BookRemovedEvent } from '../book-domain/events/book-removed.event';
import { Condition } from '../book-domain/enums/condition.enum';
import { BookEventTypes } from '../book-domain/enums/book-event-types.enum';
import { OnEvent } from '@nestjs/event-emitter';

@EventSubscriber(
  BookRegisteredEvent,
  BookBorrowedEvent,
  BookReturnedEvent,
  BookDamagedEvent,
  BookRepairedEvent,
  BookRemovedEvent,
)
export class BookProjector implements IEventSubscriber {
  private readonly logger = new Logger(BookProjector.name);

  constructor(private prismaService: PrismaService) {}

  @OnEvent('book.*')
  async handle(envelope: EventEnvelope) {
    this.logger.log(`Received BookRegisteredEvent: ${envelope.event}`);
    await this.applyEvent(envelope);
  }

  async applyEvent(envelope: EventEnvelope) {
    const { event, metadata, payload: data } = envelope;
    const bookId = metadata.aggregateId;

    switch (event) {
      case BookEventTypes.BookRegistered:
        this.logger.debug('Apply book registered event');
        const { title, author, isbn } = data as {
          title: string;
          author: string;
          isbn: string;
        };
        await this.prismaService.book.upsert({
          where: { bookId },
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
        this.logger.debug('Apply book borrowed event');
        await this.prismaService.book.update({
          where: { bookId },
          data: { status: BookStatus.BORROWED },
        });
        break;
      case BookEventTypes.BookReturned:
        this.logger.debug('Apply book returned event');
        const { condition } = data as { condition: Condition };
        await this.prismaService.book.update({
          where: { bookId },
          data: {
            status:
              condition === Condition.Good
                ? BookStatus.AVAILABLE
                : BookStatus.DAMAGED,
          },
        });
        break;
      case BookEventTypes.BookDamaged:
        this.logger.debug('Apply book damaged event');
        await this.prismaService.book.update({
          where: { bookId },
          data: { status: BookStatus.DAMAGED },
        });
        break;
      case BookEventTypes.BookRepaired:
        this.logger.debug('Apply book repaired event');
        await this.prismaService.book.update({
          where: { bookId },
          data: { status: BookStatus.AVAILABLE },
        });
        break;
      case BookEventTypes.BookRemoved:
        this.logger.debug('Apply book removed event');
        await this.prismaService.book.update({
          where: { bookId },
          data: { status: BookStatus.REMOVED },
        });
        break;
    }
  }
}
