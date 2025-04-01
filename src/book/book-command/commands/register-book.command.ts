import { IsISBN, IsString } from 'class-validator';
import {
  CommandHandler,
  ICommand,
  ICommandHandler,
} from '@ocoda/event-sourcing';
import { BookRepository } from '../../shared/book.repository';
import { BookAggregate, BookId } from '../aggregates/book.aggregate';

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
    const bookAggregate = BookAggregate.registerBook(
      command.title,
      command.author,
      command.isbn,
    );

    await this.bookRepository.save(bookAggregate);

    return bookAggregate.id;
  }
}
