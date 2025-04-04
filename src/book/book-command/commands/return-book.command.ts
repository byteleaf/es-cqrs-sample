import { IsEnum, IsUUID } from 'class-validator';
import { Condition } from '../../book-domain/enums/condition.enum';
import { ApiProperty } from '@nestjs/swagger';

export class ReturnBookCommand {
  @ApiProperty({ example: 'b0b4b3b4-4b4b-4b4b-4b4b-4b4b4b4b4b4b' })
  @IsUUID()
  bookId: string;

  @ApiProperty({ example: Condition.Good })
  @IsEnum(Condition)
  condition: Condition;
}
