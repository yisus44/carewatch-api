import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { CommonService } from 'src/common/common.service';
import { UserGroupService } from 'src/user-groups/user-group.service';

@Injectable()
export class ReminderExecutionService implements OnModuleInit {
  private readonly daysOfWeek: { [key: string]: string } = {
    L: '1',
    M: '2',
    Mr: '3',
    J: '4',
    V: '5',
    S: '6',
    D: '7',
  };
  constructor(
    private readonly userGroupService: UserGroupService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly commonService: CommonService,
  ) {}

  async onModuleInit() {
    // const seconds = 5;
    // const job = new CronJob(`${seconds} * * * * *`, () => {
    //   console.log(`time (${seconds}) for job  to run!`);
    // });
    // this.schedulerRegistry.addCronJob('name', job);
    // job.start();
  }
  createOrUpdateSpecificDayOfTheWeek(
    hour: string,
    days: string,
    name: string,
    fn: Function,
  ) {
    const daysArray = days.split(',').map((day) => this.daysOfWeek[day.trim()]);
    const validDays = daysArray.filter((day) => !!day);
    const [hours, minutes, seconds] = hour.split(':').map(Number);
    try {
      this.schedulerRegistry.getCronJob(name);
      this.schedulerRegistry.deleteCronJob(name);
    } catch (error) {
      //The schedulerRegistry will throw an exception if they do not found a cronjob so we do not need
      //to handle anything here...yet
    }
    // Create a cron expression with the specified hour and days
    const cronExpression = `${seconds} ${minutes} ${hours} * * ${validDays.join(
      ',',
    )}`;
    const job = new CronJob(cronExpression, () => {
      fn();
    });

    job.start();
    this.schedulerRegistry.addCronJob(name, job);
  }
  createOrUpdateSpecificDate(
    hourToBeExecuted: string,
    dateToBeExecuted: string,
    name: string,
    fn: Function,
  ) {
    const { executionDate } = this.commonService.parseDate(
      hourToBeExecuted,
      dateToBeExecuted,
    );
    try {
      this.schedulerRegistry.getTimeout(name);
      this.schedulerRegistry.deleteTimeout(name);
    } catch (error) {
      //The schedulerRegistry will throw an exception if they do not found a timeout so we do not need
      //to handle anything here...yet
    }

    const currentTimestamp = new Date().getTime();
    const delay = executionDate.getTime() - currentTimestamp;
    if (delay <= 0) {
      Logger.warn('The specified time has already passed.');
      return;
    }
    const timeoutId = setTimeout(fn, delay);
    this.schedulerRegistry.addTimeout(name, timeoutId);

    // const cronExpression = `${second} ${minute} ${hour} ${day} ${month} *`;
    // console.log({ cronExpression });
    // const job = new CronJob(cronExpression, () => {
    //   console.log(`Scheduled job ran at ${hour}:${minute}:${second}`);
    // });
    // this.schedulerRegistry.addTimeout('namexx', job);
    // job.start();
  }
  removeWithName(name: string) {
    try {
      this.schedulerRegistry.getTimeout(name);
      this.schedulerRegistry.deleteTimeout(name);
    } catch (error) {
      //The schedulerRegistry will throw an exception if they do not found a timeout so we do not need
      //to handle anything here...yet
    }
    try {
      this.schedulerRegistry.getInterval(name);
      this.schedulerRegistry.deleteInterval(name);
    } catch (error) {
      //The schedulerRegistry will throw an exception if they do not found a timeout so we do not need
      //to handle anything here...yet
    }
    try {
      this.schedulerRegistry.getCronJob(name);
      this.schedulerRegistry.deleteCronJob(name);
    } catch (error) {
      //The schedulerRegistry will throw an exception if they do not found a timeout so we do not need
      //to handle anything here...yet
    }
  }
}
