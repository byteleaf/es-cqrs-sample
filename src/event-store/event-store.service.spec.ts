import { Test, TestingModule } from '@nestjs/testing';
import { EventStoreService } from './event-store.service';
import { PrismaModule } from '../prisma/prisma.module';

describe('EventStoreService', () => {
  let service: EventStoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventStoreService],
      imports: [PrismaModule],
    }).compile();

    service = module.get<EventStoreService>(EventStoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
