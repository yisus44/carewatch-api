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
import { ReminderFrequenciesService } from './reminder-frequencies.service';
import { CreateReminderFrequencyDto } from './dto/create-reminder-frequency.dto';
import { UpdateReminderFrequencyDto } from './dto/update-reminder-frequency.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('reminder-frequencies')
export class ReminderFrequenciesController {
  constructor(
    private readonly reminderFrequenciesService: ReminderFrequenciesService,
  ) {}

  @Post()
  create(@Body() createReminderFrequencyDto: CreateReminderFrequencyDto) {
    return this.reminderFrequenciesService.create(createReminderFrequencyDto);
  }

  @Get()
  findAll(@Query() PaginationDto: PaginationDto) {
    return this.reminderFrequenciesService.findPaginated(PaginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reminderFrequenciesService.findOneById(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReminderFrequencyDto: UpdateReminderFrequencyDto,
  ) {
    return this.reminderFrequenciesService.update(
      id,
      updateReminderFrequencyDto,
    );
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.reminderFrequenciesService.remove(id);
  }
}
