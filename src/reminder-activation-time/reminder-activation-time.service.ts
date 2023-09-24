import { BadRequestException, Injectable } from '@nestjs/common';
import { CoreService } from 'src/core/core.service';
import { ReminderActivationTime } from './entities/reminder-activation-time.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReminderActivationTimeDto } from './dto/create-reminder-activation-time.dto';
import { FrequencyTypesService } from 'src/frequency-types/frequency-types.service';
import { RelationDoNotExistsException } from 'src/common/exceptions/relation-do-not-exists.exception';
import { FrequencyTypeEnum } from 'src/frequency-types/entities/frequency-type.entity';

@Injectable()
export class ReminderActivationTimeService extends CoreService<ReminderActivationTime> {
  constructor(
    @InjectRepository(ReminderActivationTime)
    private readonly reminderActivationTimeRepository: Repository<ReminderActivationTime>,
    private readonly frequencyTypeService: FrequencyTypesService,
  ) {
    super(reminderActivationTimeRepository);
  }
  override async create(
    createReminderActivationTimeDto: CreateReminderActivationTimeDto,
  ): Promise<ReminderActivationTime> {
    const frequencyType = await this.frequencyTypeService.findOneById(
      createReminderActivationTimeDto.frequencyTypeId,
    );
    if (!frequencyType) throw new RelationDoNotExistsException();
    if (
      frequencyType.name === FrequencyTypeEnum.SPECIFC_DATE ||
      frequencyType.name === FrequencyTypeEnum.SPECIFC_WEEKDAY
    ) {
      return super.create({
        ...createReminderActivationTimeDto,
        intialDateTime: null,
      });
    } else {
      //when we want to execute the reminder
      // every x numbers seconds, minutes, hours and day
      return super.create({
        ...createReminderActivationTimeDto,
        intialDateTime:
          createReminderActivationTimeDto.intialDateTime ?? new Date(),
        time: null,
      });
    }
  }
}
