import { IsEnum, IsUUID } from 'class-validator';
import { Condition } from '../../enums/condition.enum';

export class ReturnBookCommand {
  @IsUUID()
  bookId: string;

  @IsEnum(Condition)
  condition: Condition;
}
