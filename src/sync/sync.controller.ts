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
import { SyncPushService } from './sync-push.service';
import { SyncDto } from './dto/sync.pull.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { GetCurrentUser } from 'src/auth/decorators/current-user';
import { User } from 'src/users/entities/user.entity';
import { PullSyncDto } from './dto/sync-group.pull.dto';
import { SyncPullService } from './sync-pull.service';
import { SyncPushDto } from './dto/sync.push.dto';

@UseGuards(AuthGuard)
@Controller('sync')
export class SyncController {
  constructor(
    private readonly syncService: SyncPushService,
    private readonly syncSPullervice: SyncPullService,
  ) {}

  @Post('/push')
  toUpload(@Body() syncDto: SyncPushDto, @GetCurrentUser() user: User) {
    return this.syncService.toUpload(syncDto, user);
  }

  // @Get()
  // toReturn(@GetCurrentUser() user: User, @Query('date') date: Date) {
  //   console.log({ user });
  //   return this.syncService.toReturn(date, user);
  // }

  @Post('/pull')
  toReturn(@GetCurrentUser() user: User, @Body() pullSyncDto: PullSyncDto) {
    return this.syncSPullervice.toReturn(pullSyncDto, user);
  }
}
