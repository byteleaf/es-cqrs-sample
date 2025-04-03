import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BorrowBookCommand {
  @ApiProperty({ example: 'b0b4b3b4-4b4b-4b4b-4b4b-4b4b4b4b4b4b' })
  @IsUUID()
  bookId: string;

  @ApiProperty({ example: 'reader-123' })
  @IsString() // Usually, this would be a UUID, but for simplicity (sample data use "reader-123" as id), we're using a string
  readerId: string;
}
