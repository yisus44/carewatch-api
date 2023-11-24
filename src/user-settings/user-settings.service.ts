import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserSettingDto } from './dto/create-user-setting.dto';
import { UpdateUserSettingDto } from './dto/update-user-setting.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSetting } from './entities/user-setting.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { DeleteResult, Repository } from 'typeorm';
import { PageDto } from '../common/dto/page.dto';
import { PostgresErrorCode } from '../database/postgresErrorCodes.enum';
import { User } from '../users/entities/user.entity';
import { CoreService } from '../core/core.service';
import { UserNotFoundException } from '../common/exceptions/user-not-found.excepction';

@Injectable()
export class UserSettingsService extends CoreService<UserSetting> {
  constructor(
    @InjectRepository(UserSetting)
    private readonly userSettingRepository: Repository<UserSetting>,
  ) {
    super(userSettingRepository);
  }
  async findAll(
    paginationDto: PaginationDto,
    currentUser: User,
  ): Promise<PageDto<UserSetting[]>> {
    return await super.findPaginated(
      paginationDto,
      {
        userId: currentUser.id,
      },
      {
        createdAt: 'desc',
      },
    );
  }

  async batchCreate(entities: Partial<UserSetting>[]) {
    const promiseArr = [];
    if (!entities) return;
    for (const entity of entities) {
      delete entity.id;
      promiseArr.push(this.create(entity as UserSetting));
    }
    await Promise.all(promiseArr);
  }
  async batchUpdate(entities: Partial<UserSetting>[]) {
    const promiseArr = [];
    if (!entities) return;
    for (const entity of entities) {
      promiseArr.push(this.update(entity.id, entity));
    }
    await Promise.all(promiseArr);
  }
  async findOne(id: number): Promise<UserSetting | null> {
    return await this.userSettingRepository.findOneBy({ id });
  }

  async create(createFileTypeDto: CreateUserSettingDto): Promise<UserSetting> {
    try {
      const userSetting = await super.create({
        ...createFileTypeDto,
      });
      return userSetting;
    } catch (error) {
      if (error?.code === PostgresErrorCode.ForeignKeyViolation) {
        throw new UserNotFoundException();
      }
      throw error;
    }
  }
}
