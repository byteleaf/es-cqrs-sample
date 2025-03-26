import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('BookQueryController (e2e)', () => {
  let app: INestApplication;
  let bookId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.setGlobalPrefix('api');
    await app.init();

    const response = await request(app.getHttpServer())
      .post('/api/v1/books/commands/register')
      .send({
        title: 'The Lord of the Rings',
        author: 'J.R.R. Tolkien',
        isbn: '978-3-16-148410-0',
      })
      .expect(201);

    bookId = response.body.bookId;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should get the book', () => {
    return request(app.getHttpServer())
      .get(`/api/v1/books/queries/${bookId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.bookId).toBe(bookId);
      });
  });

  it('should return 404 for non-existing book', () => {
    return request(app.getHttpServer())
      .get('/api/v1/books/queries/non-existing-id')
      .expect(404);
  });
});
