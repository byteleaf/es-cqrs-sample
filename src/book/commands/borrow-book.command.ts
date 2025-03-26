import { IsString, IsUUID } from 'class-validator';

export class BorrowBookCommand {
  @IsUUID()
  bookId: string;

  @IsString() // Usually, this would be a UUID, but for simplicity (sample data use "reader-123" as id), we're using a string
  readerId: string;
}
