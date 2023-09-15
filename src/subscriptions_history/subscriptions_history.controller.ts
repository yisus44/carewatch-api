import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SubscriptionsHistoryService } from './subscriptions_history.service';
import { CreateSubscriptionsHistoryDto } from './dto/create-subscriptions_history.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { GetCurrentUser } from '../auth/decorators/current-user';
import { User } from 'src/users/entities/user.entity';

@Controller('subscriptions-history')
export class SubscriptionsHistoryController {
  constructor(
    private readonly subscriptionsHistoryService: SubscriptionsHistoryService,
  ) {}

  @Post()
  create(@Body() createSubscriptionsHistoryDto: CreateSubscriptionsHistoryDto) {
    return this.subscriptionsHistoryService.create(
      createSubscriptionsHistoryDto,
    );
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Query() paginationDto: PaginationDto, @GetCurrentUser() user: User) {
    return this.subscriptionsHistoryService.findAllUserSubscription(
      user,
      paginationDto,
    );
  }
}
