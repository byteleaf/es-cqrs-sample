import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { RegisterBookCommand } from './commands/register-book.command';
import { BorrowBookCommand } from './commands/borrow-book.command';
import { ReturnBookCommand } from './commands/return-book.command';
import { RepairBookCommand } from './commands/repair-book.command';
import { RemoveBookCommand } from './commands/remove-book.command';
import { CommandBus } from '@ocoda/event-sourcing';

@Controller('v1/books/commands')
export class BookCommandController {
  constructor(private readonly commandBus: CommandBus) {}

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

  @Post('return')
  @HttpCode(204)
  async returnBook(@Body() returnBookCommand: ReturnBookCommand) {
    await this.commandBus.execute<ReturnBookCommand>(returnBookCommand);
  }

  @Post('repair')
  @HttpCode(204)
  async repairBook(@Body() repairBookCommand: RepairBookCommand) {
    await this.commandBus.execute<RepairBookCommand>(repairBookCommand);
  }

  @Post('remove')
  @HttpCode(204)
  async removeBook(@Body() removeBookCommand: RemoveBookCommand) {
    await this.commandBus.execute<RemoveBookCommand>(removeBookCommand);
  }
  //
  // @Get('state/:id')
  // getBookState(@Param('id') id: string, @Query('revision') revision?: number) {
  //   return this.bookCommandService.getBookState(id, revision);
  // }
  //
  // @Post('replay/:id')
  // @HttpCode(204)
  // replayEvents(@Param('id') id: string, @Query('revision') revision?: number) {
  //   return this.bookCommandService.replayEvents(id, revision);
  // }
}
