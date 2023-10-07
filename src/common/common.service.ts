import { Injectable } from '@nestjs/common';
import { PaginationDto } from './dto/pagination.dto';
import { PageDto } from './dto/page.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CommonService {
  parseDurationToMilliseconds(duration: string): number {
    const durationRegex = /^(\d+)([smhdwMy])$/;
    const [, value, unit] = duration.match(durationRegex);
    const unitToMilliseconds: Record<string, number> = {
      s: 1000, // seconds
      m: 60000, // minutes
      h: 3600000, // hours
      d: 86400000, // days
      w: 604800000, // weeks
      M: 2592000000, // months (approximation: 30 days)
      y: 31536000000, // years (approximation: 365 days)
    };
    const milliseconds = parseInt(value) * unitToMilliseconds[unit];
    return milliseconds;
  }

  parseDate(hourToBeExecuted: string, dateToBeExecuted: string) {
    const timeComponents = hourToBeExecuted.split(':');
    const hour = Number(timeComponents[0]);
    const minute = Number(timeComponents[1]);
    const second = Number(timeComponents[2]);
    const dateComponents = dateToBeExecuted.split('-');
    const year = Number(dateComponents[0]);
    const month = Number(dateComponents[1]) - 1;
    const day = Number(dateComponents[2]);
    const executionDate = new Date(year, month, day, hour, minute, second);
    return {
      hour,
      minute,
      second,
      year,
      month,
      day,
      executionDate,
    };
  }
}
