import { IsEnum, IsUUID } from 'class-validator';
import {
  CommandHandler,
  ICommand,
  ICommandHandler,
} from '@ocoda/event-sourcing';
import { NotFoundException } from '@nestjs/common';
import { BookId } from '../aggregates/book.aggregate';
import { BookRepository } from '../../book-domain/book.repository';
import { Condition } from '../../book-domain/enums/condition.enum';
import { ApiProperty } from '@nestjs/swagger';

export class ReturnBookCommand implements ICommand {
  @ApiProperty({ example: 'b0b4b3b4-4b4b-4b4b-4b4b-4b4b4b4b4b4b' })
  @IsUUID()
  bookId: string;

  @ApiProperty({ example: Condition.Good })
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
