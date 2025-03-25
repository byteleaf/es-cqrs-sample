import { Module } from '@nestjs/common';
import { EventStoreModule } from './event-store/event-store.module';
import { PrismaModule } from './prisma/prisma.module';
import { BookModule } from './book/book.module';
import { CqrsModule } from '@nestjs/cqrs';
import { SnapshotModule } from './snapshot/snapshot.module';

@Module({
  imports: [
    EventStoreModule,
    PrismaModule,
    BookModule,
    CqrsModule.forRoot(),
    SnapshotModule,
  ],
})
export class AppModule {}
