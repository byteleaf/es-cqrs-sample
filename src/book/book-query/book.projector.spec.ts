import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../../prisma/prisma.module';
import { BookProjector } from './book.projector';

describe('BookProjectorService', () => {
  let service: BookProjector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookProjector],
      imports: [PrismaModule],
    }).compile();

    service = module.get<BookProjector>(BookProjector);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
