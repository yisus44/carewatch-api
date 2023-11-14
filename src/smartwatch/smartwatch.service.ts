import { Injectable } from '@nestjs/common';
import { CreateSmartwatchDto } from './dto/create-smartwatch.dto';
import { UpdateSmartwatchDto } from './dto/update-smartwatch.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Smartwatch } from './entities/smartwatch.entity';
import { Repository } from 'typeorm';
import { CoreService } from 'src/core/core.service';

@Injectable()
export class SmartwatchService extends CoreService<Smartwatch> {
  constructor(
    @InjectRepository(Smartwatch)
    private readonly userSettingRepository: Repository<Smartwatch>,
  ) {
    super(userSettingRepository);
  }
}
