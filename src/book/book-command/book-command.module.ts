import { Module } from '@nestjs/common';
import { BookCommandController } from './book-command.controller';
import { RegisterBookCommandHandler } from './commands/register-book.command';
import { BorrowBookCommandHandler } from './commands/borrow-book.command';
import { RemoveBookCommandHandler } from './commands/remove-book.command';
import { RepairBookCommandHandler } from './commands/repair-book.command';
import { ReturnBookCommandHandler } from './commands/return-book.command';
import { ReplayBookCommandHandler } from './commands/replay-book.command';
import { BookDomainModule } from '../book-domain/book-domain.module';

@Module({
  imports: [BookDomainModule],
  providers: [
    RegisterBookCommandHandler,
    BorrowBookCommandHandler,
    RemoveBookCommandHandler,
    RepairBookCommandHandler,
    ReturnBookCommandHandler,
    ReplayBookCommandHandler,
  ],
  controllers: [BookCommandController],
})
export class BookCommandModule {}
