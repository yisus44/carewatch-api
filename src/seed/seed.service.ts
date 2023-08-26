import { Injectable } from '@nestjs/common';
import { FileTypeService } from '../file-type/file-type.service';
import { FilesService } from '../files/files.service';
import { UsersService } from '../users/users.service';
import { fileTypeData } from './data/file-type.seed';
import { CreateFileTypeDto } from '../file-type/dto/create-file-type.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { userSeed } from './data/user.seed';
import { SignUpDto } from '../auth/dto/signup.dto';
import { AuthService } from '../auth/auth.service';
import { CreateMedicineUnitDto } from '../medicine-units/dto/create-medicine-unit.dto';
import { MediceUnitsSeed } from './data/medicine-units.seed';
import { MedicineUnitsService } from '../medicine-units/medicine-units.service';
import { CreateWeekDayDto } from '../week-days/dto/create-week-day.dto';
import { weekDaysSeed } from './data/week-days.seed';
import { WeekDaysService } from '../week-days/week-days.service';
import { frequencyUnitSeed } from './data/frequency-unit.seed';
import { FrequencyUnitsService } from '../frequency-units/frequency-units.service';
import { CreateFrequencyUnitDto } from '../frequency-units/dto/create-frequency-unit.dto';
@Injectable()
export class SeedService {
  constructor(
    private readonly fileTypeService: FileTypeService,
    private readonly fileService: FilesService,
    private readonly userService: UsersService,
    private readonly authService: AuthService,
    private readonly medicineUnitService: MedicineUnitsService,
    private readonly weekDaysService: WeekDaysService,
    private readonly frequencyUnitService: FrequencyUnitsService,
  ) {}
  async seed() {
    this.seedFileType();
    this.seedUsers();
    this.seedMedicineUnits();
    this.seedWeekDay();
    this.seedFrequencyUnits();
    return 'finished';
  }

  async seedFrequencyUnits() {
    return await this.seedBulk<CreateFrequencyUnitDto>(
      frequencyUnitSeed,
      this.frequencyUnitService,
    );
  }
  async seedFileType() {
    return await this.seedBulk<CreateFileTypeDto>(
      fileTypeData,
      this.fileTypeService,
    );
  }
  async seedUsers() {
    return await this.seedBulk<SignUpDto>(userSeed, this.authService, 'signUp');
  }

  async seedMedicineUnits() {
    return await this.seedBulk<CreateMedicineUnitDto>(
      MediceUnitsSeed,
      this.medicineUnitService,
    );
  }

  async seedWeekDay() {
    return await this.seedBulk<CreateWeekDayDto>(
      weekDaysSeed,
      this.weekDaysService,
    );
  }
  async seedBulk<T>(seedDataCollection: T[], service: any, method = 'create') {
    const promiseArr = [];
    for (const seedData of seedDataCollection) {
      promiseArr.push(service[method](seedData));
    }
    return await Promise.allSettled(promiseArr);
  }
}
