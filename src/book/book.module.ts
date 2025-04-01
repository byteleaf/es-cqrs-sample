import { Module } from '@nestjs/common';
import { BookCommandController } from './book-command.controller';
import { BookQueryController } from './book-query.controller';
import { BorrowBookCommandHandler } from './commands/borrow-book.command';
import { RegisterBookCommandHandler } from './commands/register-book.command';
import { BookRepository } from './repository/book.repository';
import { RemoveBookCommandHandler } from './commands/remove-book.command';
import { RepairBookCommandHandler } from './commands/repair-book.command';
import { ReturnBookCommandHandler } from './commands/return-book.command';
import { EventSourcingModule } from '@ocoda/event-sourcing';
import {
  PostgresEventStore,
  type PostgresEventStoreConfig,
  PostgresSnapshotStore,
  type PostgresSnapshotStoreConfig,
} from '@ocoda/event-sourcing-postgres';
import { Events } from './events';
import { GetBookByIdQueryHandler } from './queries/get-book.query';

@Module({
  imports: [
    EventSourcingModule.forRootAsync<
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
  providers: [
    RegisterBookCommandHandler,
    BorrowBookCommandHandler,
    RemoveBookCommandHandler,
    RepairBookCommandHandler,
    ReturnBookCommandHandler,
    GetBookByIdQueryHandler,
    BookRepository,
  ],
  controllers: [BookCommandController, BookQueryController],
})
export class BookModule {}
