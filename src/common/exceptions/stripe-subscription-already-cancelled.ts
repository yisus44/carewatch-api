import { NotFoundException } from '@nestjs/common';

export class StripeSubscriptionAlreadyCancelledException extends NotFoundException {
  constructor() {
    super('Subscription already cancelled');
  }
}
