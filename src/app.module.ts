import { Module } from '@nestjs/common';
import { EventStoreModule } from './event-store/event-store.module';
import { PrismaModule } from './prisma/prisma.module';
import { SnapshotModule } from './snapshot/snapshot.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BookModule } from './book/book.module';

@Module({
  imports: [
    EventEmitterModule.forRoot({ wildcard: true }),
    EventStoreModule,
    PrismaModule,
    SnapshotModule,
    BookModule,
  ],
})
export class AppModule {}
