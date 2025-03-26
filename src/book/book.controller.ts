import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { BookService } from './book.service';
import { ApiOperation } from '@nestjs/swagger';
import { RegisterBookCommand } from './commands/register-book.command';
import { BorrowBookCommand } from './commands/borrow-book.command';
import { ReturnBookCommand } from './commands/return-book.command';
import { RepairBookCommand } from './commands/repair-book.command';
import { RemoveBookCommand } from './commands/remove-book.command';

@Controller('v1/books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post('register')
  registerBook(@Body() registerBookCommand: RegisterBookCommand) {
    return this.bookService.registerBook(registerBookCommand);
  }

  @ApiOperation({ summary: 'Borrow a book' })
  @Post('borrow')
  @HttpCode(204)
  borrowBook(@Body() borrowBookCommand: BorrowBookCommand) {
    return this.bookService.borrowBook(borrowBookCommand);
  }

  @Post('return')
  @HttpCode(204)
  returnBook(@Body() returnBookCommand: ReturnBookCommand) {
    return this.bookService.returnBook(returnBookCommand);
  }

  @Post('repair')
  @HttpCode(204)
  repairBook(@Body() repairBookCommand: RepairBookCommand) {
    return this.bookService.repairBook(repairBookCommand);
  }

  @Post('remove')
  @HttpCode(204)
  removeBook(@Body() removeBookCommand: RemoveBookCommand) {
    return this.bookService.removeBook(removeBookCommand);
  }

  @Get('state/:id')
  getBookState(@Param('id') id: string, @Query('revision') revision?: number) {
    return this.bookService.getBookState(id, revision);
  }

  @Get(':id')
  queryBook(@Param('id') id: string) {
    return this.bookService.queryBook(id);
  }

  @Post('replay/:id')
  @HttpCode(204)
  replayEvents(@Param('id') id: string, @Query('revision') revision?: number) {
    return this.bookService.replayEvents(id, revision);
  }
}
