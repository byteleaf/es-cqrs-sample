import { IsISBN, IsString } from 'class-validator';

export class RegisterBookCommand {
  @IsString()
  title: string;

  @IsString()
  author: string;

  @IsISBN()
  isbn: string;
}
