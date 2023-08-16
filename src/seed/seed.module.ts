import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { FileTypeModule } from 'src/file-type/file-type.module';
import { FilesModule } from 'src/files/files.module';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { MedicineUnitsModule } from 'src/medicine-units/medicine-units.module';
import { WeekDaysModule } from 'src/week-days/week-days.module';
import { FrequencyUnitsModule } from 'src/frequency-units/frequency-units.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [
    FileTypeModule,
    FilesModule,
    UsersModule,
    MedicineUnitsModule,
    AuthModule,
    WeekDaysModule,
    FrequencyUnitsModule,
  ],
})
export class SeedModule {}
