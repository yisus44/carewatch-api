import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserSettingDto } from './dto/create-user-setting.dto';
import { UpdateUserSettingDto } from './dto/update-user-setting.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSetting } from './entities/user-setting.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { DeleteResult, Repository } from 'typeorm';
import { PageDto } from 'src/common/dto/page.dto';
import { PostgresErrorCode } from 'src/database/postgresErrorCodes.enum';
import { User } from 'src/users/entities/user.entity';
import { CoreService } from 'src/core/core.service';

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

  async findOne(id: number): Promise<UserSetting | null> {
    return await this.userSettingRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.userSettingRepository.delete(id);
  }

  async update(id: number, updateFileDto: UpdateUserSettingDto) {
    return await this.userSettingRepository.update({ id }, updateFileDto);
  }
  async create(createFileTypeDto: CreateUserSettingDto): Promise<UserSetting> {
    try {
      const userSetting = await super.create({
        ...createFileTypeDto,
      });
      return userSetting;
    } catch (error) {
      if (error?.code === PostgresErrorCode.ForeignKeyViolation) {
        throw new BadRequestException('User do not exist');
      }
      throw error;
    }
  }
}
