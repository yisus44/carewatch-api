import { Injectable } from '@nestjs/common';
import { CreateReminderFrequencyDto } from './dto/create-reminder-frequency.dto';
import { UpdateReminderFrequencyDto } from './dto/update-reminder-frequency.dto';
import { CoreService } from '../core/core.service';
import { ReminderFrequency } from './entities/reminder-frequency.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ReminderFrequenciesService extends CoreService<ReminderFrequency> {
  constructor(
    @InjectRepository(ReminderFrequency)
    reminderFrequencyRepository: Repository<ReminderFrequency>,
  ) {
    super(reminderFrequencyRepository);
  }
}
