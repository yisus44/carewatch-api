import { Injectable } from '@nestjs/common';
import { CreateFrequencyTypeDto } from './dto/create-frequency-type.dto';
import { UpdateFrequencyTypeDto } from './dto/update-frequency-type.dto';
import { CoreService } from 'src/core/core.service';
import { FrequencyType } from './entities/frequency-type.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FrequencyTypesService extends CoreService<FrequencyType> {
  constructor(
    @InjectRepository(FrequencyType)
    private readonly frequencyTypeRepository: Repository<FrequencyType>,
  ) {
    super(frequencyTypeRepository);
  }
}
