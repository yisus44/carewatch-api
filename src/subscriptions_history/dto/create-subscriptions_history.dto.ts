import {
  IsInt,
  IsJSON,
  IsNotEmpty,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateSubscriptionsHistoryDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  subscriptionId: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(200)
  stripePaymentId: string;

  @IsNotEmpty()
  @IsString()
  @IsJSON()
  @MinLength(10)
  @MaxLength(200)
  stripePaymentObject: string;
}
