import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { GetCurrentUser } from 'src/auth/decorators/current-user';
import { User } from 'src/users/entities/user.entity';
import { AuthGuard } from 'src/auth/guards/auth.guard';
@UseGuards(AuthGuard)
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post('/subscribe')
  create(@GetCurrentUser() currentUser: User) {
    return this.subscriptionsService.subscribe(currentUser);
  }

  @Post('/unsubscribe')
  remove(@GetCurrentUser() currentUser: User) {
    return this.subscriptionsService.unsubscribe(currentUser);
  }
}
