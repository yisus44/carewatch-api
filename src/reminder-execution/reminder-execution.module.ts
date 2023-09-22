import { Module } from '@nestjs/common';
import { ReminderExecutionService } from './reminder-execution.service';
import { UserGroupModule } from 'src/user-groups/user-group.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  providers: [ReminderExecutionService],
  imports: [UserGroupModule, ScheduleModule.forRoot()],
})
export class ReminderExecutionModule {}
