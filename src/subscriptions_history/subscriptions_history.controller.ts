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
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { User } from 'aws-sdk/clients/budgets';
import { GetCurrentUser } from 'src/auth/decorators/current-user';

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
  findAll(
    @Query() paginationDto: PaginationDto,
    @GetCurrentUser() currentUser: User,
  ) {
    return this.subscriptionsHistoryService.findAll(paginationDto, currentUser);
  }
}
