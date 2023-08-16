import { Module } from '@nestjs/common';
import { ReminderFrequenciesService } from './reminder-frequencies.service';
import { ReminderFrequenciesController } from './reminder-frequencies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReminderFrequency } from './entities/reminder-frequency.entity';

@Module({
  controllers: [ReminderFrequenciesController],
  providers: [ReminderFrequenciesService],
  exports: [ReminderFrequenciesService],
  imports: [TypeOrmModule.forFeature([ReminderFrequency])],
})
export class ReminderFrequenciesModule {}
