import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateStripeSubscriptiontDto {
  @IsNotEmpty()
  @IsString()
  stripeCustomerId: string;
}
