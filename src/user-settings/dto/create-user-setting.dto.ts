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
  @MaxLength(50)
  key: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  value: string;

  userId: number;
}
