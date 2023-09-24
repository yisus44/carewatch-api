import { IsNotEmpty, IsOptional } from 'class-validator';

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
  intialDateTime?: Date;
}
