import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateMedicineUnitDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  description: string;
}
