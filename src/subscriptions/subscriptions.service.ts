import { Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
@Injectable()
export class SubscriptionsService {
  create(createSubscriptionDto: CreateSubscriptionDto) {
    return 'This action adds a new subscription';
  }

  remove(id: number) {
    return `This action removes a #${id} subscription`;
  }
}
