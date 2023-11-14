import { PartialType } from '@nestjs/mapped-types';
import { CreateSmartwatchDto } from './create-smartwatch.dto';

export class UpdateSmartwatchDto extends PartialType(CreateSmartwatchDto) {}
