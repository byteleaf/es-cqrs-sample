import { Test, TestingModule } from '@nestjs/testing';
import { BookCommandController } from './book-command.controller';
import { BookCommandService } from './book-command.service';
import { EventStoreModule } from '../event-store/event-store.module';
import { BookProjectorService } from './book-projector.service';
import { PrismaModule } from '../prisma/prisma.module';
import { SnapshotModule } from '../snapshot/snapshot.module';

describe('BookCommandController', () => {
  let controller: BookCommandController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookCommandController],
      providers: [BookCommandService, BookProjectorService],
      imports: [PrismaModule, EventStoreModule, SnapshotModule],
    }).compile();

    controller = module.get<BookCommandController>(BookCommandController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
