import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateReminderTimeDto {
  @IsNotEmpty()
  reminderId: number;

  @IsOptional()
  atTime?: Date;

  @IsOptional()
  eachHours?: string;

  @IsOptional()
  atWeekdays?: string;

  @IsOptional()
  eachDays?: number;

  @IsOptional()
  initialDateTime: Date;
}
