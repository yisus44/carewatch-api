import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateReminderTimeDto {
  @IsNotEmpty()
  reminderId: number;

  @IsOptional()
  atTime?: string;

  @IsOptional()
  eachHours?: string;

  @IsOptional()
  atWeekdays?: string;

  @IsOptional()
  eachDays?: number;

  @IsOptional()
  initialDateTime: Date;
}
