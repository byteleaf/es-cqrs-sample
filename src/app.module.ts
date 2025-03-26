import { Module } from '@nestjs/common';
import { EventStoreModule } from './event-store/event-store.module';
import { PrismaModule } from './prisma/prisma.module';
import { BookCommandModule } from './book-command/book-command.module';
import { SnapshotModule } from './snapshot/snapshot.module';
import { BookQueryModule } from './book-query/book-query.module';

@Module({
  imports: [
    EventStoreModule,
    PrismaModule,
    BookCommandModule,
    SnapshotModule,
    BookQueryModule,
  ],
})
export class AppModule {}
