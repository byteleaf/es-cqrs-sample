import { Book as BookEntity } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class Book {
  @ApiProperty({ example: 'a008cc92-82ad-40d8-9174-ccb7ba5cc7aa' })
  bookId: string;

  @ApiProperty({ example: 'The Lord of the Rings' })
  title: string;

  @ApiProperty({ example: 'J.R.R. Tolkien' })
  author: string;

  @ApiProperty({ example: '978-0-395-19395-2' })
  isbn: string;

  @ApiProperty({ example: 'AVAILABLE' })
  status: string;

  static fromEntity(book: BookEntity): Book {
    return {
      bookId: book.bookId,
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      status: book.status,
    };
  }
}
