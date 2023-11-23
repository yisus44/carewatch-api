import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateReminderTimeDto } from './dto/create-reminder-time.dto';
import { UpdateReminderTimeDto } from './dto/update-reminder-time.dto';
import { CoreService } from 'src/core/core.service';
import { ReminderTime } from './entities/reminder-time.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReminderExecutionService } from 'src/reminder-execution/reminder-execution.service';
import { ReminderTimeHelper } from './reminder-time-execution.helper';

@Injectable()
export class ReminderTimeService
  extends CoreService<ReminderTime>
  implements OnModuleInit
{
  constructor(
    @InjectRepository(ReminderTime)
    private readonly reminderActivationTimeRepository: Repository<ReminderTime>,
    private readonly reminderExecutionService: ReminderExecutionService,
    private readonly reminderTimeHelper: ReminderTimeHelper,
  ) {
    super(reminderActivationTimeRepository);
  }
  async onModuleInit() {
    if (process.env.CONTAINER_ROLE == 'ONLY_DATA_STORAGE') return;
    const newDate = new Date();
    const reminderTimes = await this.reminderActivationTimeRepository.find({});
    const promiseArr = [];
    for (const reminderTime of reminderTimes) {
      promiseArr.push(this.handleReminderTimeExecution(reminderTime));
    }
    await Promise.all(promiseArr);
    console.log({ postLoadDate: new Date().getTime() - newDate.getTime() });
  }

  async batchAdd(entities: ReminderTime[]) {
    const promiseArr = [];
    if (!entities) return;
    for (const entity of entities) {
      delete entity.id;
      promiseArr.push(this.create(entity));
    }
    await Promise.all(promiseArr);
  }

  async handleReminderTimeExecution(reminderTime: ReminderTime) {
    const reminderFunction = async () => {
      await this.reminderTimeHelper.executeReminder(
        reminderTime.reminderId,
        reminderTime.id,
      );
    };
    if (reminderTime.atWeekdays && reminderTime.atTime) {
      //specific days like tuesday 9:45
      if (reminderTime.atWeekdays === 'DIARIO') {
        reminderTime.atWeekdays = 'L,M,Mr,J,V,S,D';
      }
      this.reminderExecutionService.createOrUpdateSpecificDayOfTheWeek(
        reminderTime.atTime,
        reminderTime.atWeekdays,
        reminderTime.id.toString(),
        reminderFunction,
      );
    } else if (reminderTime.atWeekdays === 'DIARIO' && reminderTime.eachHours) {
      //everyday each x hours counting from the initial daytime
      this.reminderExecutionService.createOrUpdateFrequency(
        reminderTime.initialDateTime.toString(),
        (Number(reminderTime.eachHours) * 60 * 60).toString(),
        reminderTime.id.toString(),
        reminderFunction,
      );
    } else if (reminderTime.eachDays && reminderTime.atTime) {
      //each days at a specific time like every 3 days at 15:00
      //TODO: incomplet
      this.reminderExecutionService.createOrUpdateSpecificTimeEachDays(
        reminderTime.atTime,
        reminderTime.eachDays,
        reminderTime.id.toString(),
        new Date(reminderTime.initialDateTime),
        reminderFunction,
      );
    }
  }
  async create(createReminderTimeDto: CreateReminderTimeDto) {
    const reminderTime = await super.create(createReminderTimeDto);

    await this.handleReminderTimeExecution(reminderTime);

    return reminderTime;
  }
}
