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
import { SyncService } from './sync.service';
import { SyncDto } from './dto/sync.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { GetCurrentUser } from 'src/auth/decorators/current-user';
import { User } from 'src/users/entities/user.entity';

@UseGuards(AuthGuard)
@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post()
  toUpload(@Body() syncDto: SyncDto, @GetCurrentUser() user: User) {
    return this.syncService.toUpload(syncDto, user);
  }

  @Get()
  toReturn(@GetCurrentUser() user: User, @Query('date') date: Date) {
    console.log({ user });
    return this.syncService.toReturn(date, user);
  }
}
