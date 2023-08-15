import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateReminderDto {
  @IsNotEmpty()
  @IsPositive()
  groupId: number;

  @IsNotEmpty()
  @IsPositive()
  medicineId: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  name: string;

  @IsNotEmpty()
  @IsPositive()
  dosis: number;

  @IsNotEmpty()
  @IsBoolean()
  enableBasic: boolean;

  @IsNotEmpty()
  @IsBoolean()
  enableCustom: boolean;

  @IsNotEmpty()
  @IsBoolean()
  enableVoiceAssistant: boolean;

  @IsNotEmpty()
  @IsBoolean()
  enableSmartwatch: boolean;

  @IsNotEmpty()
  @IsString()
  additionalDetails: string;
}
