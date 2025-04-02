import { Controller, Get, Param, Query } from '@nestjs/common';
import { QueryBus } from '@ocoda/event-sourcing';
import { GetBookByIdQuery } from './queries/get-book.query';
import { GetBookStateByIdQuery } from './queries/get-book-state-query';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Book } from './dto/book.dto';
import { BookState } from './dto/book-state.dto';

@ApiTags('queries')
@Controller('v1/books/queries')
export class BookQueryController {
  constructor(private readonly queryBus: QueryBus) {}

  @ApiOperation({ summary: 'Get book' })
  @ApiResponse({ status: 200, description: 'Book', type: Book })
  @Get(':id')
  async queryBook(@Param('id') id: string): Promise<Book> {
    const query = new GetBookByIdQuery(id);
    return this.queryBus.execute(query);
  }

  @ApiOperation({ summary: 'Get book state' })
  @ApiResponse({ status: 200, description: 'Book state', type: BookState })
  @Get('state/:id')
  queryBookState(
    @Param('id') id: string,
    @Query('revision') revision?: number,
  ): Promise<BookState> {
    const query = new GetBookStateByIdQuery(id, revision);
    return this.queryBus.execute(query);
  }
}
