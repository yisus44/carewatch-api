import { Module } from '@nestjs/common';
import { MedicineUnitsService } from './medicine-units.service';
import { MedicineUnitsController } from './medicine-units.controller';
import { MedicineUnit } from './entities/medicine-unit.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [MedicineUnitsController],
  providers: [MedicineUnitsService],
  exports: [MedicineUnitsService],
  imports: [TypeOrmModule.forFeature([MedicineUnit])],
})
export class MedicineUnitsModule {}
