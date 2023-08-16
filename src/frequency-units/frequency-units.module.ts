import { Module } from '@nestjs/common';
import { FrequencyUnitsService } from './frequency-units.service';
import { FrequencyUnitsController } from './frequency-units.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FrequencyUnit } from './entities/frequency-unit.entity';

@Module({
  controllers: [FrequencyUnitsController],
  providers: [FrequencyUnitsService],
  exports: [FrequencyUnitsService],
  imports: [TypeOrmModule.forFeature([FrequencyUnit])],
})
export class FrequencyUnitsModule {}
