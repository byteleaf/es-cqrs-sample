import { Test, TestingModule } from '@nestjs/testing';
import { BookCommandService } from './book-command.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PrismaModule } from '../../prisma/prisma.module';
import { EventSourcingModule } from '../../event-sourcing/event-sourcing.module';

describe('BookCommandService', () => {
  let service: BookCommandService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookCommandService],
      imports: [
        PrismaModule,
        EventSourcingModule,
        EventEmitterModule.forRoot(),
      ],
    }).compile();

    service = module.get<BookCommandService>(BookCommandService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
