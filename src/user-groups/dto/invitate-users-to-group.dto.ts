import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateIf,
} from 'class-validator';

export class InvitateUsersToGroup {
  @ValidateIf(() => false)
  groupId: number;

  @IsOptional()
  @IsArray()
  carewatchInvitation: CareWatchInvitation[] = [];

  @IsOptional()
  @IsArray()
  whatsappInvitation: WhatsAppInvitation[] = [];

  @IsOptional()
  @IsArray()
  emailInvitation: EmailInvitation[] = [];
}

class EmailInvitation {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}

class WhatsAppInvitation {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsPositive()
  phone: number;
}

class CareWatchInvitation {
  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
