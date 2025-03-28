import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BookModule } from './book/book.module';
import { EventSourcingModule } from './event-sourcing/event-sourcing.module';

@Module({
  imports: [
    EventEmitterModule.forRoot({ wildcard: true }),
    PrismaModule,
    BookModule,
    EventSourcingModule,
  ],
})
export class AppModule {}
