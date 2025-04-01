import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@ocoda/event-sourcing';
import { GetBookByIdQuery } from './queries/get-book.query';

@Controller('v1/books/queries')
export class BookQueryController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':id')
  async queryBook(@Param('id') id: string) {
    const query = new GetBookByIdQuery(id);
    return this.queryBus.execute(query);
  }
}
