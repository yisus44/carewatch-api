import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SyncService } from './sync.service';
import { SyncDto } from './dto/sync.dto';

@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post()
  toUpload(@Body() SyncDto: SyncDto) {
    return this.syncService.SyncDto(SyncDto);
  }

  @Get()
  toReturn(@Query('date') date: string) {
    return this.syncService.toReturn(date);
  }
}
