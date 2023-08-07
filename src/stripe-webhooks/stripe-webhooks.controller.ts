import {
  Controller,
  Post,
  Req,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import { StripeWebhooksService } from './stripe-webhooks.service';
import RequestWithRawBody from 'src/common/interface/requestWithRawBody.interface';

@Controller('stripe-webhooks')
export class StripeWebhooksController {
  constructor(private readonly stripeWebhooksService: StripeWebhooksService) {}

  @Post()
  async handleIncomingEvents(
    @Headers('stripe-signature') signature: string,
    @Req() request: RequestWithRawBody,
  ) {
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }

    return this.stripeWebhooksService.handleSubscriptionPayment(
      signature,
      request.rawBody,
    );
  }
}
