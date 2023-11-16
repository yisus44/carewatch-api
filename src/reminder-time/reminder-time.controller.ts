import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ReminderTimeService } from './reminder-time.service';
import { CreateReminderTimeDto } from './dto/create-reminder-time.dto';
import { UpdateReminderTimeDto } from './dto/update-reminder-time.dto';

@Controller('reminder-time')
export class ReminderTimeController {
  constructor(private readonly reminderTimeService: ReminderTimeService) {}

  @Post()
  create(@Body() createReminderTimeDto: CreateReminderTimeDto) {
    return this.reminderTimeService.create(createReminderTimeDto);
  }

  @Get()
  findAll() {
    return this.reminderTimeService.findPaginated();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reminderTimeService.findOneById(+id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReminderTimeDto: UpdateReminderTimeDto,
  ) {
    return this.reminderTimeService.update(+id, updateReminderTimeDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.reminderTimeService.remove(+id);
  }
}
