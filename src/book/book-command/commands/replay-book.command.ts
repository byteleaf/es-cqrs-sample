import { IsNumber, IsUUID } from 'class-validator';
import {
  CommandHandler,
  EVENT_METADATA,
  EventEnvelope,
  EventEnvelopeMetadata,
  EventId,
  ICommand,
  ICommandHandler,
  IEvent,
} from '@ocoda/event-sourcing';
import { BookId } from '../aggregates/book.aggregate';
import { BookRepository } from '../../book-domain/book.repository';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Logger } from '@nestjs/common';

export class ReplayBookCommand implements ICommand {
  @ApiProperty({ example: 'b0b4b3b4-4b4b-4b4b-4b4b-4b4b4b4b4b4b' })
  @IsUUID()
  bookId: string;

  @ApiPropertyOptional({ example: '1' })
  @IsNumber()
  revision?: number;

  constructor(bookId: string, revision?: number) {
    this.bookId = bookId;
    this.revision = revision;
  }
}

@CommandHandler(ReplayBookCommand)
export class ReplayBookCommandHandler implements ICommandHandler {
  private readonly logger = new Logger(ReplayBookCommandHandler.name);

  constructor(
    private readonly bookRepository: BookRepository,
    private readonly emitter: EventEmitter2,
  ) {}

  async execute(command: ReplayBookCommand): Promise<boolean> {
    const bookId = BookId.from(command.bookId);
    const eventStream = await this.bookRepository.getEvents(
      bookId,
      command.revision,
    );

    for await (const events of eventStream) {
      for (const event of events) {
        this.publish(command.bookId, event);
      }
    }

    return true;
  }

  private publish(aggregateId: string, event: IEvent): void {
    const classRef = event.constructor;
    const eventMetadata = Reflect.getMetadata(EVENT_METADATA, classRef);

    this.logger.log(
      `ReplayEventPublisher - Publishing event type: ${JSON.stringify(eventMetadata)} - event: ${JSON.stringify(event)};`,
    );

    const eventEnvelope = EventEnvelope.from(
      eventMetadata.name,
      event,
      this.createDummyEventMetadata(aggregateId),
    );

    this.emitter.emit(eventMetadata.name, eventEnvelope);
  }

  private createDummyEventMetadata(aggregateId: string): EventEnvelopeMetadata {
    return {
      aggregateId,
      eventId: EventId.generate(),
      version: 0,
      occurredOn: new Date(),
    };
  }
}
