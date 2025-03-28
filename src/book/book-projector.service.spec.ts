import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../prisma/prisma.module';
import { BookProjectorService } from './book-projector.service';
import { EventSourcingModule } from '../event-sourcing/event-sourcing.module';

describe('BookProjectorService', () => {
  let service: BookProjectorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookProjectorService],
      imports: [PrismaModule, EventSourcingModule],
    }).compile();

    service = module.get<BookProjectorService>(BookProjectorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
