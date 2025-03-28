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

@Module({
  imports: [
    PrismaModule,
    EventSourcingModule.forRootAsync<
      PostgresEventStoreConfig,
      PostgresSnapshotStoreConfig
    >({
      useFactory: () => ({
        events: [],
        eventStore: {
          driver: PostgresEventStore,
          host: '127.0.0.1',
          port: 5432,
          user: 'postgres',
          password: 'postgres',
          database: 'postgres',
          useDefaultPool: false,
        },
        snapshotStore: {
          driver: PostgresSnapshotStore,
          host: '127.0.0.1',
          port: 5432,
          user: 'postgres',
          password: 'postgres',
          database: 'postgres',
          useDefaultPool: false,
        },
      }),
    }),
    BookModule,
  ],
})
export class AppModule {}
