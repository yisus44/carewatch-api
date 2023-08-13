import { Injectable } from '@nestjs/common';
import { FileTypeService } from 'src/file-type/file-type.service';
import { FilesService } from 'src/files/files.service';
import { UsersService } from 'src/users/users.service';
import { fileTypeData } from './data/file-type.seed';
import { CreateFileTypeDto } from 'src/file-type/dto/create-file-type.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { userSeed } from './data/user.seed';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { AuthService } from 'src/auth/auth.service';
@Injectable()
export class SeedService {
  constructor(
    private readonly fileTypeService: FileTypeService,
    private readonly fileService: FilesService,
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {}
  async seed() {
    this.seedFileType();
    this.seedUsers();
    return 'finished';
  }

  async seedFileType() {
    return await this.seedBulk<CreateFileTypeDto>(
      fileTypeData,
      this.fileTypeService,
    );
  }
  async seedUsers() {
    return await this.seedBulk<RegisterDto>(
      userSeed,
      this.authService,
      'signUp',
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
