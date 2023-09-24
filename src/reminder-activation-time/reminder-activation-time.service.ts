import { Injectable } from '@nestjs/common';
import { CoreService } from 'src/core/core.service';
import { ReminderActivationTime } from './entities/reminder-activation-time.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ReminderActivationTimeService extends CoreService<ReminderActivationTime> {
  constructor(
    @InjectRepository(ReminderActivationTime)
    private readonly reminderActivationTimeRepository: Repository<ReminderActivationTime>,
  ) {
    super(reminderActivationTimeRepository);
  }
}
