import { IsString, IsUUID } from 'class-validator';

export class RepairBookCommand {
  @IsUUID()
  bookId: string;

  @IsString()
  comment: string;
}
