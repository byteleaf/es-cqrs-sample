import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { BookModule } from './book/book.module';
import { EventSourcingModule } from '@ocoda/event-sourcing';
import {
  PostgresEventStore,
  PostgresEventStoreConfig,
  PostgresSnapshotStore,
  PostgresSnapshotStoreConfig,
} from '@ocoda/event-sourcing-postgres';
import { Events } from './book/book-command/events/';

@Module({
  imports: [
    PrismaModule,
    EventSourcingModule.forRootAsync<
      PostgresEventStoreConfig,
      PostgresSnapshotStoreConfig
    >({
      useFactory: () => ({
        events: Events,
        eventStore: {
          driver: PostgresEventStore,
          host: '127.0.0.1',
          port: 5432,
          user: 'admin',
          password: 'password',
          database: 'postgres',
          useDefaultPool: false,
        },
        snapshotStore: {
          driver: PostgresSnapshotStore,
          host: '127.0.0.1',
          port: 5432,
          user: 'admin',
          password: 'password',
          database: 'postgres',
          useDefaultPool: false,
        },
      }),
    }),
    BookModule,
  ],
})
export class AppModule {}
