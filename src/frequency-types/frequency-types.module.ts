import { Module } from '@nestjs/common';
import { FrequencyTypesService } from './frequency-types.service';
import { FrequencyTypesController } from './frequency-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FrequencyType } from './entities/frequency-type.entity';

@Module({
  controllers: [FrequencyTypesController],
  providers: [FrequencyTypesService],
  imports: [TypeOrmModule.forFeature([FrequencyType])],
  exports: [FrequencyTypesService],
})
export class FrequencyTypesModule {}
