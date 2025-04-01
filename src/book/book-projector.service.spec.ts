import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../prisma/prisma.module';
import { BookProjectorService } from './book-projector.service';

describe('BookProjectorService', () => {
  let service: BookProjectorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookProjectorService],
      imports: [PrismaModule],
    }).compile();

    service = module.get<BookProjectorService>(BookProjectorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
