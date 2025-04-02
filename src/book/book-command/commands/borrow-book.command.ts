import { IsString, IsUUID } from 'class-validator';
import {
  CommandHandler,
  ICommand,
  ICommandHandler,
} from '@ocoda/event-sourcing';
import { NotFoundException } from '@nestjs/common';
import { BookRepository } from '../../book-domain/book.repository';
import { BookId } from '../aggregates/book.aggregate';
import { ApiProperty } from '@nestjs/swagger';

export class BorrowBookCommand implements ICommand {
  @ApiProperty({ example: 'b0b4b3b4-4b4b-4b4b-4b4b-4b4b4b4b4b4b' })
  @IsUUID()
  bookId: string;

  @ApiProperty({ example: 'reader-123' })
  @IsString() // Usually, this would be a UUID, but for simplicity (sample data use "reader-123" as id), we're using a string
  readerId: string;
}

@CommandHandler(BorrowBookCommand)
export class BorrowBookCommandHandler implements ICommandHandler {
  constructor(private readonly bookRepository: BookRepository) {}

  async execute(command: BorrowBookCommand): Promise<boolean> {
    const bookId = BookId.from(command.bookId);
    const bookAggregate = await this.bookRepository.getById(bookId);

    if (!bookAggregate) {
      throw new NotFoundException('Book not found');
    }
    bookAggregate.borrowBook(bookId, command.readerId);

    await this.bookRepository.save(bookAggregate);

    return true;
  }
}
