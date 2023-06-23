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

@Injectable()
export class UserSettingsService {
  constructor(
    @InjectRepository(UserSetting)
    private readonly userSettingRepository: Repository<UserSetting>,
  ) {}
  async findAll(
    paginationDto: PaginationDto,
    currentUser: User,
  ): Promise<PageDto<UserSetting[]>> {
    const { page, perPage } = paginationDto;
    const skippedItems = (page - 1) * perPage;
    const [data, totalCount] = await this.userSettingRepository.findAndCount({
      skip: skippedItems,
      take: perPage,
      where: {
        userId: currentUser.id,
      },
      order: {
        createdAt: 'desc',
      },
    });
    const totalPages = Math.ceil(totalCount / perPage);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;
    return {
      data,
      page,
      perPage,
      totalPages,
      hasNextPage,
      hasPreviousPage,
    };
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
  async create(
    createFileTypeDto: CreateUserSettingDto,
    userId: number,
  ): Promise<UserSetting> {
    try {
      const userSetting = this.userSettingRepository.create({
        ...createFileTypeDto,
        userId,
      });
      return await this.userSettingRepository.save(userSetting);
    } catch (error) {
      if (error?.code === PostgresErrorCode.ForeignKeyViolation) {
        throw new BadRequestException('User do not exist');
      }
      throw error;
    }
  }
}
