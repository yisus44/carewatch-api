import { PartialType } from '@nestjs/mapped-types';
import { CreateFrequencyUnitDto } from './create-frequency-unit.dto';

export class UpdateFrequencyUnitDto extends PartialType(CreateFrequencyUnitDto) {}
