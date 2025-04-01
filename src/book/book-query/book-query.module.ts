import { Module } from '@nestjs/common';
import { BookQueryController } from './book-query.controller';
import { BookRepositoryModule } from '../book-repository/book-repository.module';
import { EventSourcingModule } from '../event-sourcing/event-sourcing.module';

@Module({
  imports: [BookRepositoryModule, EventSourcingModule],
  providers: [],
  controllers: [BookQueryController],
})
export class BookQueryModule {}
