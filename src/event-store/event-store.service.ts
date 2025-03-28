import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Event, Prisma } from '@prisma/client';

@Injectable()
export class EventStoreService {
  constructor(private readonly prismaService: PrismaService) {}

  async appendEvent(
    aggregateId: string,
    aggregateRevision: number,
    type: string,
    data: Prisma.JsonValue,
  ) {
    return this.prismaService.event.create({
      data: {
        aggregateId,
        aggregateRevision,
        type,
        data,
      },
    });
  }

  async getEventsByAggregateId(
    aggregateId: string,
    revision?: number,
  ): Promise<Event[]> {
    return this.prismaService.event.findMany({
      where: {
        aggregateId: aggregateId,
        aggregateRevision: revision ? { lte: revision } : undefined,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getEventsByAggregateIdAfterRevision(
    aggregateId: string,
    minRevision: number,
    maxRevision?: number,
  ) {
    return this.prismaService.event.findMany({
      where: {
        aggregateId,
        aggregateRevision: {
          gt: minRevision,
          ...(maxRevision ? { lte: maxRevision } : {}),
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getCountByAggregateId(aggregateId: string): Promise<number> {
    return this.prismaService.event.count({
      where: {
        aggregateId: aggregateId,
      },
    });
  }
}
