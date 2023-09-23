import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { FileTypeModule } from '../file-type/file-type.module';
import { FilesModule } from '../files/files.module';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { MedicineUnitsModule } from '../medicine-units/medicine-units.module';
import { WeekDaysModule } from '../week-days/week-days.module';
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
  ],
})
export class SeedModule {}
