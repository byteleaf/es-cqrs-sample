import { Module } from '@nestjs/common';
import { BookQueryController } from './book-query.controller';
import { GetBookByIdQueryHandler } from './queries/get-book.query';
import { GetBookStateByIdQueryHandler } from './queries/get-book-state-query';
import { BookProjector } from './book.projector';
import { BookDomainModule } from '../book-domain/book-domain.module';

@Module({
  imports: [BookDomainModule],
  providers: [
    GetBookByIdQueryHandler,
    GetBookStateByIdQueryHandler,
    BookProjector,
  ],
  controllers: [BookQueryController],
})
export class BookQueryModule {}
