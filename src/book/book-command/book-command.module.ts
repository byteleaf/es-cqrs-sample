import { Module } from '@nestjs/common';
import { BookCommandController } from './book-command.controller';
import { BookRepositoryModule } from '../book-repository/book-repository.module';
import { RegisterBookCommandHandler } from './commands/register-book.command';
import { BorrowBookCommandHandler } from './commands/borrow-book.command';
import { RemoveBookCommandHandler } from './commands/remove-book.command';
import { RepairBookCommandHandler } from './commands/repair-book.command';
import { ReturnBookCommandHandler } from './commands/return-book.command';
import { GetBookByIdQueryHandler } from '../book-query/queries/get-book.query';
import { EventSourcingModule } from '../event-sourcing/event-sourcing.module';

@Module({
  imports: [BookRepositoryModule, EventSourcingModule],
  providers: [
    RegisterBookCommandHandler,
    BorrowBookCommandHandler,
    RemoveBookCommandHandler,
    RepairBookCommandHandler,
    ReturnBookCommandHandler,
    GetBookByIdQueryHandler,
  ],
  controllers: [BookCommandController],
})
export class BookCommandModule {}
