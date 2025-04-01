import { IsString, IsUUID } from 'class-validator';
import {
  CommandHandler,
  ICommand,
  ICommandHandler,
} from '@ocoda/event-sourcing';
import { BookId } from '../aggregates/book.aggregate';
import { NotFoundException } from '@nestjs/common';
import { BookRepository } from '../repository/book.repository';

export class RepairBookCommand implements ICommand {
  @IsUUID()
  bookId: string;

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
    bookAggregate.repairBook(command.comment);

    await this.bookRepository.save(bookAggregate);

    return true;
  }
}
