import { Injectable } from '@nestjs/common';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';
import { CoreService } from '../core/core.service';
import { Medicine } from './entities/medicine.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class MedicinesService extends CoreService<Medicine> {
  constructor(
    @InjectRepository(Medicine)
    private medicineRepository: Repository<Medicine>,
  ) {
    super(medicineRepository);
  }

  async batchUpdate(entities: Partial<Medicine>[]) {
    const promiseArr = [];
    if (!entities) return;
    for (const entity of entities) {
      promiseArr.push(this.update(entity.id, entity));
    }
    await Promise.all(promiseArr);
  }

  async batchCreate(entities: Partial<Medicine>[]) {
    const promiseArr = [];
    if (!entities) return;
    for (const entity of entities) {
      delete entity.id;
      promiseArr.push(this.create(entity as Medicine));
    }
    await Promise.all(promiseArr);
  }
}
