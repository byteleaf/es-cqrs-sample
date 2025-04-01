import { IsISBN, IsString } from 'class-validator';
import {
  CommandHandler,
  ICommand,
  ICommandHandler,
} from '@ocoda/event-sourcing';
import { BookAggregate, BookId } from '../../aggregates/book.aggregate';
import { BookRepository } from '../../book-repository/book.repository';

export class RegisterBookCommand implements ICommand {
  @IsString()
  title: string;

  @IsString()
  author: string;

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
