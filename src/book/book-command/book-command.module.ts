import { Module } from '@nestjs/common';
import { BookCommandService } from './book-command.service';
import { BookCommandController } from './book-command.controller';
import { EventSourcingModule } from '../../event-sourcing/event-sourcing.module';

@Module({
  imports: [EventSourcingModule],
  controllers: [BookCommandController],
  providers: [BookCommandService],
})
export class BookCommandModule {}
