import { Module } from '@nestjs/common';
import { RemindersService } from './reminders.service';
import { RemindersController } from './reminders.controller';
import { Reminder } from './entities/reminder.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [RemindersController],
  providers: [RemindersService],
  imports: [TypeOrmModule.forFeature([Reminder])],
  exports: [RemindersService],
})
export class RemindersModule {}
