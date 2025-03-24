import { Module } from '@nestjs/common';
import { EventStoreModule } from './event-store/event-store.module';
import { PrismaModule } from './prisma/prisma.module';
import { BookModule } from './book/book.module';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [EventStoreModule, PrismaModule, BookModule, CqrsModule.forRoot()],
})
export class AppModule {}
