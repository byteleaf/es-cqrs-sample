import { Module } from '@nestjs/common';
import { BookModule } from './book/book.module';
import { EventSourcingModule } from './event-sourcing/event-sourcing.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [BookModule, EventSourcingModule, PrismaModule],
})
export class AppModule {}
