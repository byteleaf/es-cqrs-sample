import { Module } from '@nestjs/common';
import { EventStoreModule } from './event-store/event-store.module';
import { PrismaModule } from './prisma/prisma.module';
import { BookCommandModule } from './book-command/book-command.module';
import { SnapshotModule } from './snapshot/snapshot.module';
import { BookQueryModule } from './book-query/book-query.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    EventEmitterModule.forRoot({ wildcard: true }),
    EventStoreModule,
    PrismaModule,
    BookCommandModule,
    SnapshotModule,
    BookQueryModule,
  ],
})
export class AppModule {}
