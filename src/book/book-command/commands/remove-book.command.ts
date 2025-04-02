import { IsString, IsUUID } from 'class-validator';
import {
  CommandHandler,
  ICommand,
  ICommandHandler,
} from '@ocoda/event-sourcing';
import { NotFoundException } from '@nestjs/common';
import { BookId } from '../aggregates/book.aggregate';
import { BookRepository } from '../../book-domain/book.repository';
import { ApiProperty } from '@nestjs/swagger';

export class RemoveBookCommand implements ICommand {
  @ApiProperty({ example: 'b0b4b3b4-4b4b-4b4b-4b4b-4b4b4b4b4b4b' })
  @IsUUID()
  bookId: string;

  @ApiProperty({ example: 'Book is unrepairable' })
  @IsString()
  reason: string;
}

@CommandHandler(RemoveBookCommand)
export class RemoveBookCommandHandler implements ICommandHandler {
  constructor(private readonly bookRepository: BookRepository) {}

  async execute(command: RemoveBookCommand): Promise<boolean> {
    const bookId = BookId.from(command.bookId);
    const bookAggregate = await this.bookRepository.getById(bookId);

    if (!bookAggregate) {
      throw new NotFoundException('Book not found');
    }
    bookAggregate.removeBook(bookId, command.reason);

    await this.bookRepository.save(bookAggregate);

    return true;
  }
}
