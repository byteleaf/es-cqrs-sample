import { Module } from '@nestjs/common';
import { BookCommandService } from './book-command.service';
import { BookCommandController } from './book-command.controller';
import { BookProjectorService } from './book-projector.service';
import { EventStoreModule } from '../event-store/event-store.module';
import { SnapshotModule } from '../snapshot/snapshot.module';

@Module({
  imports: [EventStoreModule, SnapshotModule],
  controllers: [BookCommandController],
  providers: [BookCommandService, BookProjectorService],
})
export class BookCommandModule {}
