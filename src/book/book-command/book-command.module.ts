import { Module } from '@nestjs/common';
import { BookCommandController } from './book-command.controller';
import { BookRepositoryModule } from '../book-repository/book-repository.module';
import { RegisterBookCommandHandler } from './commands/register-book.command';
import { BorrowBookCommandHandler } from './commands/borrow-book.command';
import { RemoveBookCommandHandler } from './commands/remove-book.command';
import { RepairBookCommandHandler } from './commands/repair-book.command';
import { ReturnBookCommandHandler } from './commands/return-book.command';

@Module({
  imports: [BookRepositoryModule],
  providers: [
    RegisterBookCommandHandler,
    BorrowBookCommandHandler,
    RemoveBookCommandHandler,
    RepairBookCommandHandler,
    ReturnBookCommandHandler,
  ],
  controllers: [BookCommandController],
})
export class BookCommandModule {}
