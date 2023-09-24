import { Module } from '@nestjs/common';
import { ReminderActivationTimeService } from './reminder-activation-time.service';
import { ReminderActivationTimeController } from './reminder-activation-time.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReminderActivationTime } from './entities/reminder-activation-time.entity';
import { FrequencyTypesModule } from 'src/frequency-types/frequency-types.module';

@Module({
  controllers: [ReminderActivationTimeController],
  providers: [ReminderActivationTimeService],
  imports: [
    TypeOrmModule.forFeature([ReminderActivationTime]),
    FrequencyTypesModule,
  ],
  exports: [ReminderActivationTimeService],
})
export class ReminderActivationTimeModule {}
