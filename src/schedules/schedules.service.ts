import { Injectable } from '@nestjs/common';
import { CoreService } from 'src/core/core.service';
import { Schedule } from './entities/schedule.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SchedulesService extends CoreService<Schedule> {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {
    super(scheduleRepository);
  }
}
