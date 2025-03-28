import { Controller, Get, Param } from '@nestjs/common';
import { BookQueryService } from './book-query.service';

@Controller('v1/books/queries')
export class BookQueryController {
  constructor(private readonly bookQueryService: BookQueryService) {}

  @Get(':id')
  queryBook(@Param('id') id: string) {
    return this.bookQueryService.queryBook(id);
  }
}
