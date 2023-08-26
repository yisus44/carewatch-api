import { Injectable } from '@nestjs/common';
import { CoreService } from '../core/core.service';
import { ReminderActivationTime } from './entities/reminder-activation-time.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ReminderActivationTimeService extends CoreService<ReminderActivationTime> {
  constructor(
    @InjectRepository(ReminderActivationTime)
    private readonly reminderActivationRepository: Repository<ReminderActivationTime>,
  ) {
    super(reminderActivationRepository);
  }
}
