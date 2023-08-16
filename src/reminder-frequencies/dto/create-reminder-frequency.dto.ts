import { IsISO8601, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateReminderFrequencyDto {
  @IsNotEmpty()
  @IsPositive()
  frequencyUnitId: number;

  @IsNotEmpty()
  @IsISO8601()
  defaultInitDatetime: string;

  @IsNotEmpty()
  @IsPositive()
  times: number;
}
