import { Injectable } from '@nestjs/common';
import { CoreService } from '../core/core.service';
import { Reminder } from './entities/reminder.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RemindersService extends CoreService<Reminder> {
  constructor(
    @InjectRepository(Reminder)
    private readonly reminderRepository: Repository<Reminder>,
  ) {
    super(reminderRepository);
  }
}
