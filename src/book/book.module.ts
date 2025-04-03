import { Module } from '@nestjs/common';
import { BookCommandModule } from './book-command/book-command.module';
import { BookQueryModule } from './book-query/book-query.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    BookCommandModule,
    BookQueryModule,
    EventEmitterModule.forRoot({ wildcard: true }),
  ],
})
export class BookModule {}
