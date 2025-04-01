import { IsString, IsUUID } from 'class-validator';
import {
  CommandHandler,
  ICommand,
  ICommandHandler,
} from '@ocoda/event-sourcing';
import { BookRepository } from '../../shared/book.repository';
import { BookId } from '../aggregates/book.aggregate';
import { NotFoundException } from '@nestjs/common';

export class RemoveBookCommand implements ICommand {
  @IsUUID()
  bookId: string;

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
    bookAggregate.removeBook(command.reason);

    await this.bookRepository.save(bookAggregate);

    return true;
  }
}
