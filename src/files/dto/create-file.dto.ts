import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateFileDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  key: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  location: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  localLocation: string;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  fileTypeId: number;
}
