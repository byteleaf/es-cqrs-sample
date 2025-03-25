import { Module } from '@nestjs/common';
import { EventStoreModule } from './event-store/event-store.module';
import { PrismaModule } from './prisma/prisma.module';
import { BookModule } from './book/book.module';
import { SnapshotModule } from './snapshot/snapshot.module';

@Module({
  imports: [EventStoreModule, PrismaModule, BookModule, SnapshotModule],
})
export class AppModule {}
