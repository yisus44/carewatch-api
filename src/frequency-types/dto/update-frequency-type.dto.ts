import { PartialType } from '@nestjs/mapped-types';
import { CreateFrequencyTypeDto } from './create-frequency-type.dto';

export class UpdateFrequencyTypeDto extends PartialType(CreateFrequencyTypeDto) {}
