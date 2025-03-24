import { Body, Controller, Post } from '@nestjs/common';
import { BookService } from './book.service';
import { BookRegistration } from './dto/book-registration.dto';
import { BookBorrow } from './dto/book-borrow.dto';

@Controller('v1/book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post('register')
  create(@Body() bookRegistration: BookRegistration) {
    return this.bookService.registerBook(bookRegistration);
  }

  @Post('borrow')
  borrow(@Body() bookBorrow: BookBorrow) {
    return this.bookService.borrowBook(bookBorrow);
  }
}
