import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('BookController (e2e)', () => {
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
  });

  afterAll(async () => {
    await app.close();
  });

  it('should register a book', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/books/register')
      .send({
        title: 'The Lord of the Rings',
        author: 'J.R.R. Tolkien',
        isbn: '978-3-16-148410-0',
      })
      .expect(201);

    bookId = response.body.bookId;
    expect(bookId).toBeDefined();
  });

  it('should borrow a book', () => {
    return request(app.getHttpServer())
      .post('/api/v1/books/borrow')
      .send({
        bookId,
        readerId: 'reader-123',
      })
      .expect(204);
  });

  it('should return a book', () => {
    return request(app.getHttpServer())
      .post('/api/v1/books/return')
      .send({
        bookId,
        condition: 'BAD',
      })
      .expect(204);
  });

  it('should repair a book', () => {
    return request(app.getHttpServer())
      .post('/api/v1/books/repair')
      .send({
        bookId,
        comment: 'Page pinned',
      })
      .expect(204);
  });

  it('should remove a book', () => {
    return request(app.getHttpServer())
      .post('/api/v1/books/remove')
      .send({
        bookId,
        reason: 'Book is unrepairable',
      })
      .expect(204);
  });

  it('should get the book state', () => {
    return request(app.getHttpServer())
      .get(`/api/v1/books/state/${bookId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toBe(bookId);
      });
  });

  it('should return 404 for non-existing book', () => {
    return request(app.getHttpServer())
      .get('/api/v1/books/state/non-existing-id')
      .expect(404);
  });
});
