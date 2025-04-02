import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterBookCommand } from './commands/register-book.command';
import { BorrowBookCommand } from './commands/borrow-book.command';
import { ReturnBookCommand } from './commands/return-book.command';
import { RepairBookCommand } from './commands/repair-book.command';
import { RemoveBookCommand } from './commands/remove-book.command';
import { CommandBus } from '@ocoda/event-sourcing';

@ApiTags('commands')
@Controller('v1/books/commands')
export class BookCommandController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOperation({ summary: 'Register a new book' })
  @Post('register')
  async registerBook(@Body() registerBookCommand: RegisterBookCommand) {
    const bookId =
      await this.commandBus.execute<RegisterBookCommand>(registerBookCommand);

    return { bookId: bookId.value };
  }

  @ApiOperation({ summary: 'Borrow a book' })
  @Post('borrow')
  @HttpCode(204)
  async borrowBook(@Body() borrowBookCommand: BorrowBookCommand) {
    await this.commandBus.execute<BorrowBookCommand>(borrowBookCommand);
  }

  @ApiOperation({ summary: 'Return a book' })
  @Post('return')
  @HttpCode(204)
  async returnBook(@Body() returnBookCommand: ReturnBookCommand) {
    await this.commandBus.execute<ReturnBookCommand>(returnBookCommand);
  }

  @ApiOperation({ summary: 'Repair a book' })
  @Post('repair')
  @HttpCode(204)
  async repairBook(@Body() repairBookCommand: RepairBookCommand) {
    await this.commandBus.execute<RepairBookCommand>(repairBookCommand);
  }

  @ApiOperation({ summary: 'Remove a book' })
  @Post('remove')
  @HttpCode(204)
  async removeBook(@Body() removeBookCommand: RemoveBookCommand) {
    await this.commandBus.execute<RemoveBookCommand>(removeBookCommand);
  }
}
