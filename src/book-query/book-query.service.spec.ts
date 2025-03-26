import { Test, TestingModule } from '@nestjs/testing';
import { BookQueryService } from './book-query.service';
import { PrismaModule } from '../prisma/prisma.module';

describe('BookQueryService', () => {
  let service: BookQueryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookQueryService],
      imports: [PrismaModule],
    }).compile();

    service = module.get<BookQueryService>(BookQueryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
