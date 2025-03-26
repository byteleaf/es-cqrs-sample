import { Test, TestingModule } from '@nestjs/testing';
import { BookCommandService } from './book-command.service';
import { PrismaModule } from '../prisma/prisma.module';
import { EventStoreModule } from '../event-store/event-store.module';
import { BookProjectorService } from './book-projector.service';
import { SnapshotModule } from '../snapshot/snapshot.module';

describe('BookCommandService', () => {
  let service: BookCommandService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookCommandService, BookProjectorService],
      imports: [PrismaModule, EventStoreModule, SnapshotModule],
    }).compile();

    service = module.get<BookCommandService>(BookCommandService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
