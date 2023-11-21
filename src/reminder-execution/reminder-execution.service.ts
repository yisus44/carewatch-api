import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { SchedulerRegistry, CronExpression } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { CommonService } from 'src/common/common.service';
import { UserGroupService } from 'src/user-groups/user-group.service';

@Injectable()
export class ReminderExecutionService {
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

  secondsToCron(seconds: number) {
    if (seconds < 1) {
      throw new Error('Input seconds must be greater than or equal to 1');
    }

    const cronExpression = [];

    let minutes = Math.floor(seconds / 60);
    seconds %= 60;

    let hours = Math.floor(minutes / 60);
    minutes %= 60;

    let days = Math.floor(hours / 24);
    hours %= 24;

    let months = Math.floor(days / 30); // Approximate, assumes 30 days per month
    days %= 30;

    if (months > 0) {
      cronExpression.push('*');
    } else {
      cronExpression.push(seconds != 0 ? `*/${seconds.toString()}` : '*');
    }

    cronExpression.push(minutes != 0 ? `*/${minutes.toString()}` : '*');
    cronExpression.push(hours != 0 ? `*/${hours.toString()}` : '*');
    cronExpression.push('*'); // Day of the month
    cronExpression.push('*'); // Month
    cronExpression.push('*'); //  day of week

    return cronExpression.join(' ');
  }

  createOrUpdateFrequency(
    initialDate: string,
    frequency: string,
    name: string,
    fn: Function,
  ) {
    const date = new Date(initialDate);
    const frequencyInSeconds = Number(frequency);
    this.removeWithName(name);
    const currentTime = new Date();

    const timeDifferenceInSeconds =
      (currentTime.getTime() - date.getTime()) / 1000;
    const remainder = timeDifferenceInSeconds % frequencyInSeconds;

    if (remainder == 0) {
      const interval = setInterval(() => {
        fn();
      }, frequencyInSeconds * 1000);
      this.schedulerRegistry.addInterval(name, interval);
    } else if (remainder < 0) {
      const timeoutId = setTimeout(() => {
        fn();
        const interval = setInterval(() => {
          fn();
        }, frequencyInSeconds * 1000);
        this.schedulerRegistry.addInterval(name, interval);
      }, (Math.abs(remainder) - 1) * 1000);
      this.schedulerRegistry.addTimeout(name, timeoutId);
    } else {
      const timeRemaining = frequencyInSeconds - remainder;
      const timeoutId = setTimeout(() => {
        fn();
        const interval = setInterval(() => {
          fn();
        }, frequencyInSeconds * 1000);
        this.schedulerRegistry.addInterval(name, interval);
      }, (timeRemaining - 1) * 1000);
      this.schedulerRegistry.addTimeout(name, timeoutId);

      return timeRemaining; // Time remaining until the next frequency interval
    }
  }

  createOrUpdateSpecificTimeEachDays(
    hour: string,
    days: number,
    name: string,
    initialDateTime: Date,
    fn: Function,
  ): void {
    const [hourOfDay, minute] = hour.split(':').map(Number);

    const currentDate = new Date();
    const timeToExecute = new Date(
      initialDateTime.getFullYear(),
      initialDateTime.getMonth(),
      initialDateTime.getDate(),
      hourOfDay,
      minute,
    );

    let timeToWait = timeToExecute.getTime() - currentDate.getTime();

    if (timeToWait < 0) {
      // If the scheduled time is in the past, calculate time until the next occurrence
      timeToWait += days * 24 * 60 * 60 * 1000; // Add 'days' in milliseconds
    }
    this.removeWithName(name);
    const timeoutId = setTimeout(() => {
      fn();
      const intervalId = setInterval(() => {
        fn();
      }, days * 24 * 60 * 60 * 1000); // Execute task every 'days' days

      this.schedulerRegistry.addInterval(name, {
        intervalId,
      });
    }, timeToWait);

    console.log('add timeout');
    this.schedulerRegistry.addTimeout(name, {
      jobId: timeoutId,
    });
  }
  //create a cronjob in a specific day of the week
  createOrUpdateSpecificDayOfTheWeek(
    hour: string,
    days: string,
    name: string,
    fn: Function,
  ) {
    const daysArray = days.split(',').map((day) => this.daysOfWeek[day.trim()]);
    const validDays = daysArray.filter((day) => !!day);
    const [hours, minutes] = hour.split(':').map(Number);
    const seconds = 0;
    this.removeWithName(name);
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
    this.removeWithName(name);

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
