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
import { WeekDaysService } from './week-days.service';
import { CreateWeekDayDto } from './dto/create-week-day.dto';
import { UpdateWeekDayDto } from './dto/update-week-day.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('week-days')
export class WeekDaysController {
  constructor(private readonly weekDaysService: WeekDaysService) {}

  @Post()
  create(@Body() createWeekDayDto: CreateWeekDayDto) {
    return this.weekDaysService.create(createWeekDayDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.weekDaysService.findPaginated(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.weekDaysService.findOneById(+id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWeekDayDto: UpdateWeekDayDto,
  ) {
    return this.weekDaysService.update(+id, updateWeekDayDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.weekDaysService.remove(+id);
  }
}
