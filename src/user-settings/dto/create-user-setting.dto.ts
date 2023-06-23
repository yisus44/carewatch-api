import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserSettingDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(64)
  key: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(64)
  value: string;
}
