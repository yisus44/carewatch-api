import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFrequencyTypeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  details: string;

  @IsNotEmpty()
  @IsString()
  format: string;
}
