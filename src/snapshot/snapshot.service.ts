import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookState } from '../book/aggregates/book.aggregate';

@Injectable()
export class SnapshotService {
  constructor(private prismaService: PrismaService) {}

  async saveSnapshot(aggregateId: string, revision: number, state: BookState) {
    await this.prismaService.snapshot.create({
      data: {
        aggregateId,
        revision,
        state,
      },
    });
  }

  async getLatestSnapshotOnRevision(aggregateId: string, revision?: number) {
    return this.prismaService.snapshot.findFirst({
      where: {
        aggregateId,
        revision: revision ? { lte: revision } : undefined,
      },
      orderBy: { revision: 'desc' },
    });
  }
}
