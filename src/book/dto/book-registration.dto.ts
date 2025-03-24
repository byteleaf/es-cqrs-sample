import { IsString } from 'class-validator';

export class BookRegistration {
  @IsString()
  title: string;

  @IsString()
  author: string;

  @IsString()
  isbn: string;
}
