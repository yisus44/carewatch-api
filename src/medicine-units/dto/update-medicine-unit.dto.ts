import { PartialType } from '@nestjs/mapped-types';
import { CreateMedicineUnitDto } from './create-medicine-unit.dto';

export class UpdateMedicineUnitDto extends PartialType(CreateMedicineUnitDto) {}
