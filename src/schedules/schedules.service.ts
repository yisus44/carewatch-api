import { Injectable } from '@nestjs/common';
import { CoreService } from '../core/core.service';
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

  async batchUpdate(entities: Partial<Schedule>[]) {
    const promiseArr = [];
    if (!entities) return;
    for (const entity of entities) {
      promiseArr.push(this.update(entity.id, entity));
    }
    await Promise.all(promiseArr);
  }

  async batchCreate(entities: Partial<Schedule>[]) {
    const promiseArr = [];
    if (!entities) return;
    for (const entity of entities) {
      delete entity.id;
      promiseArr.push(this.create(entity as Schedule));
    }
    await Promise.all(promiseArr);
  }
}
