import { Module } from '@nestjs/common';
import { WeekDaysService } from './week-days.service';
import { WeekDaysController } from './week-days.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeekDay } from './entities/week-day.entity';

@Module({
  controllers: [WeekDaysController],
  providers: [WeekDaysService],
  exports: [WeekDaysService],
  imports: [TypeOrmModule.forFeature([WeekDay])],
})
export class WeekDaysModule {}
