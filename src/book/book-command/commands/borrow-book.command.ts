import { IsString, IsUUID } from 'class-validator';
import {
  CommandHandler,
  ICommand,
  ICommandHandler,
} from '@ocoda/event-sourcing';
import { NotFoundException } from '@nestjs/common';
import { BookRepository } from '../../book-repository/book.repository';
import { BookId } from '../../aggregates/book.aggregate';

export class BorrowBookCommand implements ICommand {
  @IsUUID()
  bookId: string;

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
    bookAggregate.borrowBook(command.readerId);

    await this.bookRepository.save(bookAggregate);

    return true;
  }
}
