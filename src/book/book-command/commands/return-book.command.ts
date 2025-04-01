import { IsEnum, IsUUID } from 'class-validator';
import {
  CommandHandler,
  ICommand,
  ICommandHandler,
} from '@ocoda/event-sourcing';
import { NotFoundException } from '@nestjs/common';
import { BookId } from '../../aggregates/book.aggregate';
import { BookRepository } from '../../book-repository/book.repository';
import { Condition } from '../../enums/condition.enum';

export class ReturnBookCommand implements ICommand {
  @IsUUID()
  bookId: string;

  @IsEnum(Condition)
  condition: Condition;
}

@CommandHandler(ReturnBookCommand)
export class ReturnBookCommandHandler implements ICommandHandler {
  constructor(private readonly bookRepository: BookRepository) {}

  async execute(command: ReturnBookCommand): Promise<boolean> {
    const bookId = BookId.from(command.bookId);
    const bookAggregate = await this.bookRepository.getById(bookId);

    if (!bookAggregate) {
      throw new NotFoundException('Book not found');
    }
    bookAggregate.returnBook(bookId, command.condition);

    await this.bookRepository.save(bookAggregate);

    return true;
  }
}
