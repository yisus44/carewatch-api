import { Injectable } from '@nestjs/common';
import { CreateMedicineUnitDto } from './dto/create-medicine-unit.dto';
import { UpdateMedicineUnitDto } from './dto/update-medicine-unit.dto';
import { CoreService } from '../core/core.service';
import { MedicineUnit } from './entities/medicine-unit.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MedicineUnitsService extends CoreService<MedicineUnit> {
  constructor(
    @InjectRepository(MedicineUnit)
    private medicineUnitRepository: Repository<MedicineUnit>,
  ) {
    super(medicineUnitRepository);
  }
}
