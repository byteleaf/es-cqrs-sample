import { Test, TestingModule } from '@nestjs/testing';
import { BookQueryController } from './book-query.controller';
import { BookQueryService } from './book-query.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { BookDomainModule } from '../book-domain/book-domain.module';

describe('BookQueryController', () => {
  let controller: BookQueryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookQueryController],
      providers: [BookQueryService],
      imports: [PrismaModule, BookDomainModule],
    }).compile();

    controller = module.get<BookQueryController>(BookQueryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
