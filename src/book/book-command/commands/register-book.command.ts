import { IsISBN, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterBookCommand {
  @ApiProperty({ example: 'The Lord of the Rings' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'J.R.R. Tolkien' })
  @IsString()
  author: string;

  @ApiProperty({ example: '978-0-395-19395-2' })
  @IsISBN()
  isbn: string;
}
