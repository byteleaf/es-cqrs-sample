import { Test, TestingModule } from '@nestjs/testing';
import { SnapshotService } from './snapshot.service';
import { PrismaModule } from '../prisma/prisma.module';

describe('SnapshotService', () => {
  let service: SnapshotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SnapshotService],
      imports: [PrismaModule],
    }).compile();

    service = module.get<SnapshotService>(SnapshotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
