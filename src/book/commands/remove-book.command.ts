import { IsString, IsUUID } from 'class-validator';

export class RemoveBookCommand {
  @IsUUID()
  bookId: string;

  @IsString()
  reason: string;
}
