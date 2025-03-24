import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { BookService } from './book.service';
import { BookRegistration } from './dto/book-registration.dto';
import { BookBorrow } from './dto/book-borrow.dto';
import { BookReturn } from './dto/book-return.dto';
import { BookRepair } from './dto/book-repair.dto';
import { BookRemove } from './dto/book-remove.dto';

@Controller('v1/books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post('register')
  registerBook(@Body() bookRegistration: BookRegistration) {
    return this.bookService.registerBook(bookRegistration);
  }

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
  getBookState(@Param('id') id: string) {
    return this.bookService.getBookState(id);
  }

  @Post('replay/:id')
  @HttpCode(204)
  replayEvents(@Param('id') id: string) {
    return this.bookService.replayEvents({ bookId: id });
  }
}
