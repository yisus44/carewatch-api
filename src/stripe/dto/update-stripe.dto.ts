import { PartialType } from '@nestjs/mapped-types';
import { CreateStripeClientDto } from './create-stripe-client.dto';

export class UpdateStripeDto extends PartialType(CreateStripeClientDto) {}
