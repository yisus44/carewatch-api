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
}
