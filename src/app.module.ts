import { Module } from '@nestjs/common';
import { EventStoreModule } from './event-store/event-store.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [EventStoreModule, PrismaModule],
})
export class AppModule {}
