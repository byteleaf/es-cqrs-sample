import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { PrismaModule } from '../prisma/prisma.module';
import { EventStoreModule } from '../event-store/event-store.module';
import { BookProjectorService } from './book-projector.service';

describe('BookService', () => {
  let service: BookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookService, BookProjectorService],
      imports: [PrismaModule, EventStoreModule],
    }).compile();

    service = module.get<BookService>(BookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
