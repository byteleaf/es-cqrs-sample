import { Body, Controller, HttpCode, Param, Post, Query } from '@nestjs/common';
import { BookCommandService } from './book-command.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterBookCommand } from './commands/register-book.command';
import { BorrowBookCommand } from './commands/borrow-book.command';
import { ReturnBookCommand } from './commands/return-book.command';
import { RepairBookCommand } from './commands/repair-book.command';
import { RemoveBookCommand } from './commands/remove-book.command';

@ApiTags('commands')
@Controller('v1/books/commands')
export class BookCommandController {
  constructor(private readonly bookCommandService: BookCommandService) {}

  @ApiOperation({ summary: 'Register a new book' })
  @Post('register')
  registerBook(@Body() registerBookCommand: RegisterBookCommand) {
    return this.bookCommandService.registerBook(registerBookCommand);
  }

  @ApiOperation({ summary: 'Borrow a book' })
  @Post('borrow')
  @HttpCode(204)
  borrowBook(@Body() borrowBookCommand: BorrowBookCommand) {
    return this.bookCommandService.borrowBook(borrowBookCommand);
  }

  @ApiOperation({ summary: 'Return a book' })
  @Post('return')
  @HttpCode(204)
  returnBook(@Body() returnBookCommand: ReturnBookCommand) {
    return this.bookCommandService.returnBook(returnBookCommand);
  }

  @ApiOperation({ summary: 'Repair a book' })
  @Post('repair')
  @HttpCode(204)
  repairBook(@Body() repairBookCommand: RepairBookCommand) {
    return this.bookCommandService.repairBook(repairBookCommand);
  }

  @ApiOperation({ summary: 'Remove a book' })
  @Post('remove')
  @HttpCode(204)
  removeBook(@Body() removeBookCommand: RemoveBookCommand) {
    return this.bookCommandService.removeBook(removeBookCommand);
  }

  @ApiOperation({ summary: 'Replay all events of a book' })
  @Post('replay/:id')
  @HttpCode(204)
  replayEvents(@Param('id') id: string, @Query('revision') revision?: number) {
    return this.bookCommandService.replayEvents(id, revision);
  }
}
