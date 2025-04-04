import { Controller, Get, Param, Query } from '@nestjs/common';
import { BookQueryService } from './book-query.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Book } from './dto/book.dto';
import { BookState } from './dto/book-state.dto';

@ApiTags('queries')
@Controller('v1/books/queries')
export class BookQueryController {
  constructor(private readonly bookQueryService: BookQueryService) {}

  @ApiOperation({ summary: 'Get book' })
  @ApiResponse({ status: 200, description: 'Book', type: Book })
  @Get(':id')
  queryBook(@Param('id') id: string): Promise<Book> {
    return this.bookQueryService.queryBook(id);
  }

  @ApiOperation({ summary: 'Get book state' })
  @ApiResponse({ status: 200, description: 'Book state', type: BookState })
  @Get('state/:id')
  queryBookState(
    @Param('id') id: string,
    @Query('revision') revision?: number,
  ): Promise<BookState> {
    return this.bookQueryService.queryBookState(id, revision);
  }
}
