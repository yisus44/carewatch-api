import { Injectable } from '@nestjs/common';
import { FileTypeService } from 'src/file-type/file-type.service';
import { FilesService } from 'src/files/files.service';
import { UsersService } from 'src/users/users.service';
import { fileTypeData } from './data/file-type.seed';
import { CreateFileTypeDto } from 'src/file-type/dto/create-file-type.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { userSeed } from './data/user.seed';
import { SignUpDto } from 'src/auth/dto/signup.dto';
import { AuthService } from 'src/auth/auth.service';
import { CreateMedicineUnitDto } from 'src/medicine-units/dto/create-medicine-unit.dto';
import { MediceUnitsSeed } from './data/medicine-units.seed';
import { MedicineUnitsService } from 'src/medicine-units/medicine-units.service';
import { CreateWeekDayDto } from 'src/week-days/dto/create-week-day.dto';
import { weekDaysSeed } from './data/week-days.seed';
import { WeekDaysService } from 'src/week-days/week-days.service';
import { frequencyUnitSeed } from './data/frequency-unit.seed';
import { FrequencyUnitsService } from 'src/frequency-units/frequency-units.service';
import { CreateFrequencyUnitDto } from 'src/frequency-units/dto/create-frequency-unit.dto';
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
