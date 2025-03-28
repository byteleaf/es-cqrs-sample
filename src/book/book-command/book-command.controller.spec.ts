import { Test, TestingModule } from '@nestjs/testing';
import { BookCommandController } from './book-command.controller';
import { BookCommandService } from './book-command.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PrismaModule } from '../../prisma/prisma.module';
import { EventSourcingModule } from '../../event-sourcing/event-sourcing.module';

describe('BookCommandController', () => {
  let controller: BookCommandController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookCommandController],
      providers: [BookCommandService],
      imports: [
        PrismaModule,
        EventSourcingModule,
        EventEmitterModule.forRoot(),
      ],
    }).compile();

    controller = module.get<BookCommandController>(BookCommandController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
