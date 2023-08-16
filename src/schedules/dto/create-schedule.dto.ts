import { IsNotEmpty, IsPositive, IsString, Validate } from 'class-validator';
import { IsValidTimeConstraint } from 'src/common/decorators/validators/is-valid-time';

export class CreateScheduleDto {
  @IsNotEmpty()
  @IsPositive()
  userGroupId: number;

  @IsNotEmpty()
  @IsPositive()
  weekDayId: number;

  @IsNotEmpty()
  @Validate(IsValidTimeConstraint)
  startTime: string;

  @IsNotEmpty()
  @Validate(IsValidTimeConstraint)
  endTime: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
