import { Test, TestingModule } from '@nestjs/testing';
import { BookQueryController } from './book-query.controller';
import { QueryBus } from '@ocoda/event-sourcing';

describe('BookQueryController', () => {
  let controller: BookQueryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookQueryController],
      providers: [QueryBus],
      imports: [],
    }).compile();

    controller = module.get<BookQueryController>(BookQueryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
