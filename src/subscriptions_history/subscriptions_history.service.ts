import { Injectable } from '@nestjs/common';
import { CreateSubscriptionsHistoryDto } from './dto/create-subscriptions_history.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { SubscriptionsHistory } from './entities/subscriptions_history.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SubscriptionsHistoryService {
  constructor(
    @InjectRepository(SubscriptionsHistory)
    private subscriptionsHistoryRepository: Repository<SubscriptionsHistory>,
  ) {}
  async create(createSubscriptionsHistoryDto: CreateSubscriptionsHistoryDto) {
    const subscription = this.subscriptionsHistoryRepository.create({
      ...createSubscriptionsHistoryDto,
    });
    return await this.subscriptionsHistoryRepository.save(subscription);
  }

  findAll(paginationDto: PaginationDto) {
    return `This action returns all subscriptionsHistory`;
  }
}
