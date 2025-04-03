import { IsISBN, IsString } from 'class-validator';
import {
  CommandHandler,
  ICommand,
  ICommandHandler,
} from '@ocoda/event-sourcing';
import { BookAggregate, BookId } from '../aggregates/book.aggregate';
import { BookRepository } from '../../book-domain/book.repository';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterBookCommand implements ICommand {
  @ApiProperty({ example: 'The Lord of the Rings' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'J.R.R. Tolkien' })
  @IsString()
  author: string;

  @ApiProperty({ example: '978-0-395-19395-2' })
  @IsISBN()
  isbn: string;
}

@CommandHandler(RegisterBookCommand)
export class RegisterBookCommandHandler implements ICommandHandler {
  constructor(private readonly bookRepository: BookRepository) {}

  async execute(command: RegisterBookCommand): Promise<BookId> {
    const bookId = BookId.generate();

    const bookAggregate = BookAggregate.registerBook(
      bookId,
      command.title,
      command.author,
      command.isbn,
    );

    await this.bookRepository.save(bookAggregate);

    return bookId;
  }
}
