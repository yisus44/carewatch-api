import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CoreService } from 'src/core/core.service';
import { ReminderActivationTime } from './entities/reminder-activation-time.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReminderActivationTimeDto } from './dto/create-reminder-activation-time.dto';
import { FrequencyTypesService } from 'src/frequency-types/frequency-types.service';
import { RelationDoNotExistsException } from 'src/common/exceptions/relation-do-not-exists.exception';
import {
  FrequencyType,
  FrequencyTypeEnum,
} from 'src/frequency-types/entities/frequency-type.entity';
import { ReminderExecutionService } from 'src/reminder-execution/reminder-execution.service';
import { UpdateReminderActivationTimeDto } from './dto/update-reminder-activation-time.dto';
import { ReminderActivationTimeHelperExecution } from './reminder-activation-time-execution.helper';

@Injectable()
export class ReminderActivationTimeService
  extends CoreService<ReminderActivationTime>
  implements OnModuleInit
{
  constructor(
    @InjectRepository(ReminderActivationTime)
    private readonly reminderActivationTimeRepository: Repository<ReminderActivationTime>,
    private readonly frequencyTypeService: FrequencyTypesService,
    private readonly reminderExecutionService: ReminderExecutionService,
    private readonly reminderActivationTimeExecutionHelper: ReminderActivationTimeHelperExecution,
  ) {
    super(reminderActivationTimeRepository);
  }

  async onModuleInit() {
    // const seconds = 5;
    // const job = new CronJob(`${seconds} * * * * *`, () => {
    //   console.log(`time (${seconds}) for job  to run!`);
    // });
    // this.schedulerRegistry.addCronJob('name', job);
    // job.start();
    if (process.env.CONTAINER_ROLE == 'ONLY_DATA_STORAGE') return;
    console.log({ date: new Date() });
    let newDate = new Date();
    const data = await this.reminderActivationTimeRepository.find({
      relations: {
        frequencyType: true,
      },
    });
    const promiseArr = [];
    for (const activation of data) {
      promiseArr.push(
        this.reminderActivationTimeExecutionHelper.handleExecution(
          activation,
          activation.frequencyType,
        ),
      );
    }
    await Promise.all(promiseArr);
    console.log({ postLoadDate: new Date().getTime() - newDate.getTime() });
  }

  override async create(
    createReminderActivationTimeDto: CreateReminderActivationTimeDto,
  ): Promise<ReminderActivationTime> {
    const frequencyType = await this.frequencyTypeService.findOneById(
      createReminderActivationTimeDto.frequencyTypeId,
    );
    if (!frequencyType) throw new RelationDoNotExistsException();
    const reminderActivationTime = await this.evaluateSingleOrConstant(
      frequencyType,
      async () =>
        await super.create({
          ...createReminderActivationTimeDto,
          times: 2,
          intialDateTime: null,
        }),
      async () =>
        await super.create({
          ...createReminderActivationTimeDto,
          intialDateTime:
            createReminderActivationTimeDto.intialDateTime ?? new Date(),
          time: null,
        }),
    );
    await this.reminderActivationTimeExecutionHelper.handleExecution(
      reminderActivationTime,
      frequencyType,
    );
    return reminderActivationTime;
  }

  async evaluateSingleOrConstant(
    frequencyType: FrequencyType,
    singleFrequency: Function,
    constantFrequency: Function,
  ) {
    if (
      frequencyType.name === FrequencyTypeEnum.SPECIFC_DATE ||
      frequencyType.name === FrequencyTypeEnum.SPECIFC_WEEKDAY
    ) {
      return await singleFrequency();
    } else {
      //when we want to execute the reminder
      // every x numbers seconds, minutes, hours and day
      return await constantFrequency();
    }
  }

  override async update(
    id: number,
    updateReminderActivationTimeDto: UpdateReminderActivationTimeDto,
  ) {
    let reminderActivationTime = await this.findOneById(id);
    if (!reminderActivationTime) throw new NotFoundException();

    let result;
    let frequencyType = await this.frequencyTypeService.findOneById(
      updateReminderActivationTimeDto.frequencyTypeId ??
        reminderActivationTime.frequencyTypeId,
    );
    if (!frequencyType) throw new RelationDoNotExistsException();
    result = await this.evaluateSingleOrConstant(
      frequencyType,
      async () =>
        await super.update(id, {
          ...updateReminderActivationTimeDto,
          times: 1,
          intialDateTime: null,
        }),
      async () =>
        await super.update(id, {
          ...updateReminderActivationTimeDto,
          intialDateTime:
            updateReminderActivationTimeDto.intialDateTime ?? new Date(),
          time: null,
        }),
    );

    reminderActivationTime = await this.findOneById(id);
    await this.reminderActivationTimeExecutionHelper.handleExecution(
      reminderActivationTime,
      frequencyType,
    );
    return result;
  }

  async remove(id: number) {
    this.reminderExecutionService.removeWithName(id.toString());
    return super.remove(id);
  }
}
