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

  async batchUpdate(entities: Partial<Reminder>[]) {
    const promiseArr = [];
    if (!entities) return;
    for (const entity of entities) {
      promiseArr.push(this.update(entity.id, entity));
    }
    await Promise.all(promiseArr);
  }

  async batchCreate(entities: Partial<Reminder>[]) {
    const promiseArr = [];
    if (!entities) return;
    for (const entity of entities) {
      delete entity.id;
      promiseArr.push(this.create(entity as Reminder));
    }
    await Promise.all(promiseArr);
  }
}
