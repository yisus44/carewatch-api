import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class CreateUserGroupDto {
  @IsNotEmpty()
  @IsNumber()
  groupId: number;

  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsString()
  emailCommunication?: boolean;

  @IsOptional()
  @IsString()
  whatsAppCommunication?: boolean;

  @IsOptional()
  @IsString()
  carewatchCommunication?: boolean;

  @IsOptional()
  @IsString()
  guestName?: string;

  @IsOptional()
  @IsString()
  guestEmail?: string;

  @IsOptional()
  @IsNumberString()
  guestPhone?: string;
  @ValidateIf(() => false)
  isAdmin?: boolean = false;
  @ValidateIf(() => false)
  isActive?: boolean = false;
}
