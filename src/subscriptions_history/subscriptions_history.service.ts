import { Injectable } from '@nestjs/common';
import { CreateSubscriptionsHistoryDto } from './dto/create-subscriptions_history.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { SubscriptionsHistory } from './entities/subscriptions_history.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { User } from 'aws-sdk/clients/budgets';
import { CoreService } from 'src/core/core.service';

@Injectable()
export class SubscriptionsHistoryService extends CoreService<SubscriptionsHistory> {
  constructor(
    @InjectRepository(SubscriptionsHistory)
    private subscriptionsHistoryRepository: Repository<SubscriptionsHistory>,
  ) {
    super(subscriptionsHistoryRepository);
  }
  async create(createSubscriptionsHistoryDto: CreateSubscriptionsHistoryDto) {
    const subscription = this.subscriptionsHistoryRepository.create({
      ...createSubscriptionsHistoryDto,
    });
    return await this.subscriptionsHistoryRepository.save(subscription);
  }

  async findUserSubscriptionService(subscriptionId: number) {
    const date = new Date();
    return await this.list({ subscriptionId, endDate: MoreThan(date) });
  }
}
