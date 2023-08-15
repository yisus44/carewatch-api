import { Injectable } from '@nestjs/common';
import { CreateWeekDayDto } from './dto/create-week-day.dto';
import { UpdateWeekDayDto } from './dto/update-week-day.dto';
import { CoreService } from 'src/core/core.service';
import { WeekDay } from './entities/week-day.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class WeekDaysService extends CoreService<WeekDay> {
  constructor(
    @InjectRepository(WeekDay)
    private readonly weekDayRepository: Repository<WeekDay>,
  ) {
    super(weekDayRepository);
  }
}
