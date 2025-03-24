import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class EventStoreService {
  constructor(private readonly prismaService: PrismaService) {}

  async appendEvent(event: Prisma.EventCreateInput) {
    await this.prismaService.event.create({ data: event });
  }

  async getEventsByAggregateId<T>(aggregateId: string) {
    return this.prismaService.event.findMany({
      where: {
        aggregateId: aggregateId,
      },
      orderBy: { timeOccurred: 'asc' },
    }) as T;
  }
}
