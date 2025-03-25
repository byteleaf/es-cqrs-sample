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
import { BookRegistration } from './dto/book-registration.dto';
import { BookBorrow } from './dto/book-borrow.dto';
import { BookReturn } from './dto/book-return.dto';
import { BookRepair } from './dto/book-repair.dto';
import { BookRemove } from './dto/book-remove.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('v1/books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post('register')
  registerBook(@Body() bookRegistration: BookRegistration) {
    return this.bookService.registerBook(bookRegistration);
  }

  @ApiOperation({ summary: 'Borrow a book' })
  @Post('borrow')
  @HttpCode(204)
  borrowBook(@Body() bookBorrow: BookBorrow) {
    return this.bookService.borrowBook(bookBorrow);
  }

  @Post('return')
  @HttpCode(204)
  returnBook(@Body() bookReturn: BookReturn) {
    return this.bookService.returnBook(bookReturn);
  }

  @Post('repair')
  @HttpCode(204)
  repairBook(@Body() bookRepair: BookRepair) {
    return this.bookService.repairBook(bookRepair);
  }

  @Post('remove')
  @HttpCode(204)
  removeBook(@Body() bookRepair: BookRemove) {
    return this.bookService.removeBook(bookRepair);
  }

  @Get(':id')
  getBookState(@Param('id') id: string, @Query('revision') revision?: number) {
    return this.bookService.getBookState(id, revision);
  }

  @Post('replay/:id')
  @HttpCode(204)
  replayEvents(@Param('id') id: string, @Query('revision') revision?: number) {
    return this.bookService.replayEvents(id, revision);
  }
}
