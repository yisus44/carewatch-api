import { IsNotEmpty, IsString } from 'class-validator';
import { FrequencyTypeEnum } from '../entities/frequency-type.entity';

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
