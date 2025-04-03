import { IsString, IsUUID } from 'class-validator';
import {
  CommandHandler,
  ICommand,
  ICommandHandler,
} from '@ocoda/event-sourcing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { BookRepository } from '../../book-domain/book.repository';
import { BookId } from '../aggregates/book.aggregate';
import { ApiProperty } from '@nestjs/swagger';
import { BookStatus } from '@prisma/client';

export class RepairBookCommand implements ICommand {
  @ApiProperty({ example: 'b0b4b3b4-4b4b-4b4b-4b4b-4b4b4b4b4b4b' })
  @IsUUID()
  bookId: string;

  @ApiProperty({ example: 'Page pinned' })
  @IsString()
  comment: string;
}

@CommandHandler(RepairBookCommand)
export class RepairBookCommandHandler implements ICommandHandler {
  constructor(private readonly bookRepository: BookRepository) {}

  async execute(command: RepairBookCommand): Promise<boolean> {
    const bookId = BookId.from(command.bookId);
    const bookAggregate = await this.bookRepository.getById(bookId);

    if (!bookAggregate) {
      throw new NotFoundException('Book not found');
    }

    if (bookAggregate.status !== BookStatus.DAMAGED) {
      throw new ConflictException('Book not damaged');
    }

    bookAggregate.repairBook(bookId, command.comment);

    await this.bookRepository.save(bookAggregate);

    return true;
  }
}
