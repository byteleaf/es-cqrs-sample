import { Module } from '@nestjs/common';
import {
  PostgresEventStore,
  PostgresEventStoreConfig,
  PostgresSnapshotStore,
  PostgresSnapshotStoreConfig,
} from '@ocoda/event-sourcing-postgres';
import { EventSourcingModule as OcodaEventSourcingModule } from '@ocoda/event-sourcing';
import { Events } from '../events';

@Module({
  imports: [
    OcodaEventSourcingModule.forRootAsync<
      PostgresEventStoreConfig,
      PostgresSnapshotStoreConfig
    >({
      useFactory: () => ({
        events: Events,
        eventStore: {
          driver: PostgresEventStore,
          host: '127.0.0.1',
          port: 5435,
          user: 'admin',
          password: 'password',
          database: 'ocoda',
          useDefaultPool: true,
        },
        snapshotStore: {
          driver: PostgresSnapshotStore,
          host: '127.0.0.1',
          port: 5435,
          user: 'admin',
          password: 'password',
          database: 'ocoda',
          useDefaultPool: true,
        },
      }),
    }),
  ],
  exports: [OcodaEventSourcingModule],
})
export class EventSourcingModule {}
