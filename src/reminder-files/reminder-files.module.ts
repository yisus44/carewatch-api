import { Module } from '@nestjs/common';
import { ReminderFilesService } from './reminder-files.service';
import { ReminderFilesController } from './reminder-files.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReminderFile } from './entities/reminder-file.entity';

@Module({
  controllers: [ReminderFilesController],
  providers: [ReminderFilesService],
  imports: [TypeOrmModule.forFeature([ReminderFile])],
  exports: [ReminderFilesService],
})
export class ReminderFilesModule {}
