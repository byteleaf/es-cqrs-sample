import { Test, TestingModule } from '@nestjs/testing';
import { BookCommandController } from './book-command.controller';
import { BookCommandService } from './book-command.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventStoreModule } from '../../event-store/event-store.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { SnapshotModule } from '../../snapshot/snapshot.module';

describe('BookCommandController', () => {
  let controller: BookCommandController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookCommandController],
      providers: [BookCommandService],
      imports: [
        PrismaModule,
        EventStoreModule,
        SnapshotModule,
        EventEmitterModule.forRoot(),
      ],
    }).compile();

    controller = module.get<BookCommandController>(BookCommandController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
