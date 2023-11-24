import { Injectable } from '@nestjs/common';
import { CreateReminderFileDto } from './dto/create-reminder-file.dto';
import { UpdateReminderFileDto } from './dto/update-reminder-file.dto';
import { CoreService } from '../core/core.service';
import { ReminderFile } from './entities/reminder-file.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResourceAlreadyExist } from 'src/common/exceptions/resource-already-exists.exception';

@Injectable()
export class ReminderFilesService extends CoreService<ReminderFile> {
  constructor(
    @InjectRepository(ReminderFile)
    private reminderFilesRepository: Repository<ReminderFile>,
  ) {
    super(reminderFilesRepository);
  }

  async failIfFileExist(reminderId: number, fileId: number) {
    const match = await this.findOneBy({ reminderId, fileId });
    if (match) throw new ResourceAlreadyExist();
  }

  async batchUpdate(entities: Partial<ReminderFile>[]) {
    const promiseArr = [];
    if (!entities) return;
    for (const entity of entities) {
      promiseArr.push(this.update(entity.id, entity));
    }
    await Promise.all(promiseArr);
  }

  async batchCreate(entities: Partial<ReminderFile>[]) {
    const promiseArr = [];
    if (!entities) return;
    for (const entity of entities) {
      delete entity.id;
      promiseArr.push(this.create(entity as ReminderFile));
    }
    await Promise.all(promiseArr);
  }
}
