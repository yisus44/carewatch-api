import { Module } from '@nestjs/common';
import { MedicinesService } from './medicines.service';
import { MedicinesController } from './medicines.controller';
import { Medicine } from './entities/medicine.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [MedicinesController],
  providers: [MedicinesService],
  imports: [TypeOrmModule.forFeature([Medicine])],
  exports: [MedicinesService],
})
export class MedicinesModule {}
