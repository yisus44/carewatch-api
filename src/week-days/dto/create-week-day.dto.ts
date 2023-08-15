import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWeekDayDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
