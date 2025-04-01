import { Module } from '@nestjs/common';
import { BookCommandController } from './book-command.controller';
import { RegisterBookCommandHandler } from './commands/register-book.command';
import { BorrowBookCommandHandler } from './commands/borrow-book.command';
import { RemoveBookCommandHandler } from './commands/remove-book.command';
import { RepairBookCommandHandler } from './commands/repair-book.command';
import { ReturnBookCommandHandler } from './commands/return-book.command';
import { BookRepository } from './book.repository';
import { BookSnapshotRepository } from './book-snapshot.repository';

@Module({
  imports: [],
  providers: [
    RegisterBookCommandHandler,
    BorrowBookCommandHandler,
    RemoveBookCommandHandler,
    RepairBookCommandHandler,
    ReturnBookCommandHandler,
    BookRepository,
    BookSnapshotRepository,
  ],
  controllers: [BookCommandController],
})
export class BookCommandModule {}
