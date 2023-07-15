import {
  Controller,
  Post,
  Headers,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import RequestWithRawBody from 'src/common/interface/requestWithRawBody.interface';
@Controller('stripe/webhook')
export default class StripeWebhookController {
  constructor(private readonly stripeService: StripeService) {}

  @Post()
  async handleIncomingEvents(
    @Headers('stripe-signature') signature: string,
    @Req() request: RequestWithRawBody,
  ) {
    console.log('reached');
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }

    const event = await this.stripeService.constructEventFromPayload(
      signature,
      request.rawBody,
    );
    console.log({ event });

    return event;

    // ...
  }
}
