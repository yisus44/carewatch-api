import { IsISO8601, IsNotEmpty, IsOptional } from 'class-validator';
import { IsValidTimeConstraint } from 'src/common/decorators/validators/is-valid-time';

export class CreateReminderActivationTimeDto {
  @IsNotEmpty()
  frequencyTypeId: number;

  @IsNotEmpty()
  reminderId: number;

  @IsOptional()
  time?: Date;

  @IsNotEmpty()
  times: number;

  @IsNotEmpty()
  frequencyValue: string;

  @IsOptional()
  // @IsISO8601()
  intialDateTime?: Date;
}
