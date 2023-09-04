import { Injectable } from '@nestjs/common';
import { CreateFrequencyUnitDto } from './dto/create-frequency-unit.dto';
import { UpdateFrequencyUnitDto } from './dto/update-frequency-unit.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FrequencyUnit } from './entities/frequency-unit.entity';
import { Repository } from 'typeorm';
import { CoreService } from '../core/core.service';

@Injectable()
export class FrequencyUnitsService extends CoreService<FrequencyUnit> {
  constructor(
    @InjectRepository(FrequencyUnit)
    private readonly frequencyUnitRepository: Repository<FrequencyUnit>,
  ) {
    super(frequencyUnitRepository);
  }
}
