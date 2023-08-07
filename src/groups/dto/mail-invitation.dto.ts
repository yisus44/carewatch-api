import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  isEmail,
} from 'class-validator';

export class MailInvitation {
  @IsNotEmpty()
  @IsEmail()
  guestEmail: string;
}
