import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { PrismaModule } from '../prisma/prisma.module';
import { EventStoreModule } from '../event-store/event-store.module';
import { BookProjectorService } from './book-projector.service';
import { SnapshotModule } from '../snapshot/snapshot.module';

describe('BookProjectorService', () => {
  let service: BookProjectorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookService, BookProjectorService],
      imports: [PrismaModule, EventStoreModule, SnapshotModule],
    }).compile();

    service = module.get<BookProjectorService>(BookProjectorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
