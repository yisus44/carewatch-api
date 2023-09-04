import { IsNotEmpty, IsPositive } from 'class-validator';

export class CreateReminderFileDto {
  @IsNotEmpty()
  @IsPositive()
  reminderId: number;

  @IsNotEmpty()
  @IsPositive()
  fileId: number;

  isFromCarewatch: boolean;
}
