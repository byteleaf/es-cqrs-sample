import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookState } from '../book/aggregate/book.aggregate';

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

  async getLatestSnapshot(aggregateId: string) {
    return this.prismaService.snapshot.findFirst({
      where: { aggregateId },
      orderBy: { revision: 'desc' },
    });
  }
}
