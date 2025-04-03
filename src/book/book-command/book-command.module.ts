import { Module } from '@nestjs/common';
import { BookCommandService } from './book-command.service';
import { BookCommandController } from './book-command.controller';
import { EventSourcingModule } from '../../event-sourcing/event-sourcing.module';
import { BookDomainModule } from '../book-domain/book-domain.module';

@Module({
  imports: [EventSourcingModule, BookDomainModule],
  controllers: [BookCommandController],
  providers: [BookCommandService],
})
export class BookCommandModule {}
