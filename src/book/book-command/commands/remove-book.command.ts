import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RemoveBookCommand {
  @ApiProperty({ example: 'b0b4b3b4-4b4b-4b4b-4b4b-4b4b4b4b4b4b' })
  @IsUUID()
  bookId: string;

  @ApiProperty({ example: 'Book is unrepairable' })
  @IsString()
  reason: string;
}
