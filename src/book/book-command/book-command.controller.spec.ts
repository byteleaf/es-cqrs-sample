import { Test, TestingModule } from '@nestjs/testing';
import { BookCommandController } from './book-command.controller';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CommandBus } from '@ocoda/event-sourcing';

describe('BookCommandController', () => {
  let controller: BookCommandController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookCommandController],
      providers: [CommandBus],
      imports: [EventEmitterModule.forRoot()],
    }).compile();

    controller = module.get<BookCommandController>(BookCommandController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
