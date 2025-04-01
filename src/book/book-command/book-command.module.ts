import { Module } from '@nestjs/common';
import { BookCommandController } from './book-command.controller';
import { BorrowBookCommandHandler } from './commands/borrow-book.command';
import { RegisterBookCommandHandler } from './commands/register-book.command';
import { RemoveBookCommandHandler } from './commands/remove-book.command';
import { RepairBookCommandHandler } from './commands/repair-book.command';
import { ReturnBookCommandHandler } from './commands/return-book.command';

@Module({
  controllers: [BookCommandController],
  providers: [
    RegisterBookCommandHandler,
    BorrowBookCommandHandler,
    ReturnBookCommandHandler,
    RepairBookCommandHandler,
    RemoveBookCommandHandler,
  ],
})
export class BookCommandModule {}
