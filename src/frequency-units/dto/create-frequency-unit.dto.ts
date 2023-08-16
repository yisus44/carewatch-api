import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFrequencyUnitDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
