import { Injectable } from '@nestjs/common';
import { CreateReminderTimeDto } from './dto/create-reminder-time.dto';
import { UpdateReminderTimeDto } from './dto/update-reminder-time.dto';
import { CoreService } from 'src/core/core.service';
import { ReminderTime } from './entities/reminder-time.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ReminderTimeService extends CoreService<ReminderTime> {
  constructor(
    @InjectRepository(ReminderTime)
    private readonly reminderActivationTimeRepository: Repository<ReminderTime>,
  ) {
    super(reminderActivationTimeRepository);
  }
}
