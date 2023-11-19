import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsNotEmpty()
  @IsString()
  title: string;
  @IsNotEmpty()
  @IsString()
  deviceId: string;
  @IsNotEmpty()
  @IsString()
  payload: string;
}
