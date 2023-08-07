import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateStripeClientDto {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;
}
