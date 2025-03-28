import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Snapshot } from '@prisma/client';

@Injectable()
export class SnapshotService {
  constructor(private prismaService: PrismaService) {}

  async appendSnapshot(
    aggregateId: string,
    aggregateRevision: number,
    state: Prisma.JsonValue,
  ) {
    await this.prismaService.snapshot.create({
      data: {
        aggregateId,
        aggregateRevision,
        state,
      },
    });
  }

  async getLatestSnapshotOnRevision(
    aggregateId: string,
    revision?: number,
  ): Promise<Snapshot | null> {
    return this.prismaService.snapshot.findFirst({
      where: {
        aggregateId,
        aggregateRevision: revision ? { lte: revision } : undefined,
      },
      orderBy: { aggregateRevision: 'desc' },
    });
  }
}
