import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ReminderActivationTimeService } from './reminder-activation-time.service';
import { CreateReminderActivationTimeDto } from './dto/create-reminder-activation-time.dto';
import { UpdateReminderActivationTimeDto } from './dto/update-reminder-activation-time.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('reminder-activation-time')
export class ReminderActivationTimeController {
  constructor(
    private readonly reminderActivationTimeService: ReminderActivationTimeService,
  ) {}

  @Post()
  create(
    @Body() createReminderActivationTimeDto: CreateReminderActivationTimeDto,
  ) {
    return this.reminderActivationTimeService.create(
      createReminderActivationTimeDto,
    );
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.reminderActivationTimeService.findPaginated(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reminderActivationTimeService.findOneById(+id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReminderActivationTimeDto: UpdateReminderActivationTimeDto,
  ) {
    return this.reminderActivationTimeService.update(
      +id,
      updateReminderActivationTimeDto,
    );
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.reminderActivationTimeService.remove(+id);
  }
}
