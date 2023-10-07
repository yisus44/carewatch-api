import { IsISO8601, IsNotEmpty, IsOptional, Validate } from 'class-validator';
import { IsValidTimeConstraint } from 'src/common/decorators/validators/is-valid-time';

export class CreateReminderActivationTimeDto {
  @IsNotEmpty()
  frequencyTypeId: number;

  @IsNotEmpty()
  reminderId: number;

  @IsOptional()
  @Validate(IsValidTimeConstraint)
  time?: Date;

  @IsNotEmpty()
  times: number;

  @IsNotEmpty()
  frequencyValue: string;

  @IsOptional()
  // @IsISO8601()
  intialDateTime?: Date;
}
