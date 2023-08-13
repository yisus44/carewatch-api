import { Module } from '@nestjs/common';
import { MedicineUnitsService } from './medicine-units.service';
import { MedicineUnitsController } from './medicine-units.controller';
import { MedicineUnit } from './entities/medicine-unit.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [MedicineUnitsController],
  providers: [MedicineUnitsService],
  imports: [TypeOrmModule.forFeature([MedicineUnit]), AuthModule],
})
export class MedicineUnitsModule {}
