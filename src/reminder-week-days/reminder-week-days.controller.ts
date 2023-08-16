import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ReminderWeekDaysService } from './reminder-week-days.service';
import { CreateReminderWeekDayDto } from './dto/create-reminder-week-day.dto';
import { UpdateReminderWeekDayDto } from './dto/update-reminder-week-day.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('reminder-week-days')
export class ReminderWeekDaysController {
  constructor(
    private readonly reminderWeekDaysService: ReminderWeekDaysService,
  ) {}

  @Post()
  create(@Body() createReminderWeekDayDto: CreateReminderWeekDayDto) {
    console.log({ createReminderWeekDayDto });
    console.log(new Date(createReminderWeekDayDto.time));
    return this.reminderWeekDaysService.create(createReminderWeekDayDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.reminderWeekDaysService.findPaginated(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reminderWeekDaysService.findOneById(+id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReminderWeekDayDto: UpdateReminderWeekDayDto,
  ) {
    return this.reminderWeekDaysService.update(+id, updateReminderWeekDayDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.reminderWeekDaysService.remove(+id);
  }
}
