import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class InvitateUsersToGroup {
  @IsNotEmpty()
  @IsNumber()
  groupId: number;

  @IsOptional()
  @IsArray()
  careWatchInvitation: CareWatchInvitation[];

  @IsOptional()
  @IsArray()
  whatsappInvitation: WhatsAppInvitation[];

  @IsOptional()
  @IsArray()
  emailInvitation: EmailInvitation[];
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
