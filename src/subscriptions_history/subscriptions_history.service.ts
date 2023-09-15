import { Injectable } from '@nestjs/common';
import { CreateSubscriptionsHistoryDto } from './dto/create-subscriptions_history.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { SubscriptionsHistory } from './entities/subscriptions_history.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { CoreService } from '../core/core.service';
import { User } from 'src/users/entities/user.entity';
import { SubscriptionsService } from 'src/subscriptions/subscriptions.service';

@Injectable()
export class SubscriptionsHistoryService extends CoreService<SubscriptionsHistory> {
  constructor(
    @InjectRepository(SubscriptionsHistory)
    private readonly subscriptionsHistoryRepository: Repository<SubscriptionsHistory>,
    private readonly subscriptionService: SubscriptionsService,
  ) {
    super(subscriptionsHistoryRepository);
  }

  async findUserSubscriptionService(subscriptionId: number) {
    const date = new Date();
    return await this.list({ subscriptionId, endDate: MoreThan(date) });
  }

  async findAllUserSubscription(user: User, paginationDto: PaginationDto) {
    const subscription = await this.subscriptionService.getUserSubscription(
      user,
    );
    return await this.findPaginated(paginationDto, {
      subscriptionId: subscription.id,
    });
  }
}
