import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateStripeClientDto } from './dto/create-stripe-client.dto';
import { UpdateStripeDto } from './dto/update-stripe.dto';
import Stripe from 'stripe';
import { CreateStripeSubscriptiontDto } from './dto/create-stripe-subscription-.dto';

@Injectable()
export class StripeService {
  constructor(private readonly stripe: Stripe) {}
  async createCustomer(createStripeClientDto: CreateStripeClientDto) {
    const { email } = createStripeClientDto;
    const client = await this.stripe.customers.list({
      email,
    });
    if (client.data.length > 0) return client.data[0];
    try {
      return await this.stripe.customers.create({
        email,
      });
    } catch (exception) {
      console.log(exception.message);
      throw exception;
    }
  }

  async paymentIntent(customerId: string) {
    // Use an existing Customer ID if this is a returning customer.
    const customer = await this.findCustomer(customerId);
    const ephemeralKey = await this.stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: '2022-08-01' },
    );
    const setupIntent = await this.stripe.setupIntents.create({
      customer: customer.id,
    });
    return {
      setupIntent: setupIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    };
  }
  async findCustomer(stripeCustomerId: string) {
    return await this.stripe.customers.retrieve(stripeCustomerId);
  }

  async createSubscription(
    createStripeSubscriptiontDto: CreateStripeSubscriptiontDto,
  ) {
    const { stripeCustomerId } = createStripeSubscriptiontDto;
    const price = process.env.STRIPE_PREMIUM_SUBSCRIPTION_PRICE_ID;
    const subscription = await this.stripe.subscriptions.list({
      customer: stripeCustomerId,
      price,
    });
    if (subscription.data.length > 0) return subscription.data[0];
    return await this.stripe.subscriptions.create({
      customer: stripeCustomerId,
      items: [
        {
          price,
        },
      ],
    });
  }

  findAll() {
    return `This action returns all stripe`;
  }

  findOne(id: number) {
    return `This action returns a #${id} stripe`;
  }

  update(id: number, updateStripeDto: UpdateStripeDto) {
    return `This action updates a #${id} stripe`;
  }

  remove(id: number) {
    return `This action removes a #${id} stripe`;
  }
}
