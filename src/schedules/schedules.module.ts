import { Module } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { SchedulesController } from './schedules.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';
import { UserGroupModule } from 'src/user-groups/user-group.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  controllers: [SchedulesController],
  providers: [SchedulesService],
  imports: [
    TypeOrmModule.forFeature([Schedule]),
    CacheModule.register(),
    UserGroupModule,
  ],
  exports: [SchedulesService],
})
export class SchedulesModule {}
