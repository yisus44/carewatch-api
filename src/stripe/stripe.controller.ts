import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { CreateStripeClientDto } from './dto/create-stripe-client.dto';
import { UpdateStripeDto } from './dto/update-stripe.dto';
import { CreateStripeSubscriptiontDto } from './dto/create-stripe-subscription-.dto';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('add-client')
  createCustomer(@Body() createStripeClientDto: CreateStripeClientDto) {
    return this.stripeService.createOrFindCustomer(createStripeClientDto);
  }

  @Post('create-subscription')
  createSubscription(
    @Body() createStripeSubscriptiontDto: CreateStripeSubscriptiontDto,
  ) {
    return this.stripeService.createSubscription(createStripeSubscriptiontDto);
  }

  @Get('payment-sheet/:id')
  paymentIntent(@Param('id') customerId: string) {
    return this.stripeService.paymentIntent(customerId);
  }
}
