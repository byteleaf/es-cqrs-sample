import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@ocoda/event-sourcing';
import { GetBookByIdQuery } from './queries/get-book.query';
import { GetBookStateByIdQuery } from './queries/get-book-state-query';

@Controller('v1/books/queries')
export class BookQueryController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':id')
  async queryBook(@Param('id') id: string) {
    const query = new GetBookByIdQuery(id);
    return this.queryBus.execute(query);
  }

  @Get('state/:id')
  queryBookState(@Param('id') id: string) {
    const query = new GetBookStateByIdQuery(id);
    return this.queryBus.execute(query);
  }
}
