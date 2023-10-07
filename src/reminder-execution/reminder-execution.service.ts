import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { CommonService } from 'src/common/common.service';
import { UserGroupService } from 'src/user-groups/user-group.service';

@Injectable()
export class ReminderExecutionService implements OnModuleInit {
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
  removeSpecificDate(name: string) {
    try {
      this.schedulerRegistry.getTimeout(name);
      this.schedulerRegistry.deleteTimeout(name);
    } catch (error) {
      //The schedulerRegistry will throw an exception if they do not found a timeout so we do not need
      //to handle anything here...yet
    }
  }
}
