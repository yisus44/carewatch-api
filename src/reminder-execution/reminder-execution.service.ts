import { Injectable, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { UserGroupService } from 'src/user-groups/user-group.service';

@Injectable()
export class ReminderExecutionService implements OnModuleInit {
  constructor(
    private readonly userGroupService: UserGroupService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  async onModuleInit() {
    const seconds = 5;

    const job = new CronJob(`${seconds} * * * * *`, () => {
      console.log(`time (${seconds}) for job  to run!`);
    });

    this.schedulerRegistry.addCronJob('name', job);
    job.start();
  }
}
