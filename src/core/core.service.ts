import { PaginationDto } from '../common/dto/pagination.dto';
import {
  DeepPartial,
  DeleteResult,
  FindOptionsOrder,
  FindOptionsWhere,
  Repository,
  UpdateResult,
} from 'typeorm';
import { PageDto } from '../common/dto/page.dto';
import { CoreEntity } from './entities/core-entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PostgresErrorCode } from '../database/postgresErrorCodes.enum';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { RelationDoNotExistsException } from '../common/exceptions/relation-do-not-exists.exception';

export abstract class CoreService<T extends CoreEntity> {
  constructor(private readonly repository: Repository<T>) {}

  async findPaginated(
    paginationDto: PaginationDto = { page: 1, perPage: 100 },
    findOptionsWhere: FindOptionsWhere<T> = {},
    findOptionsOrder: FindOptionsOrder<T> = {},
  ): Promise<PageDto<T[]>> {
    const { page, perPage } = paginationDto;
    const skippedItems = (page - 1) * perPage;
    const [data, totalCount] = await this.repository.findAndCount({
      skip: skippedItems,
      take: perPage,
      where: {
        ...findOptionsWhere,
        deletedAt: null,
      },
      order: findOptionsOrder,
    });
    return this.calculatePagination(data, totalCount, page, perPage);
  }

  calculatePagination(
    data: T[],
    totalCount: number,
    page: number,
    perPage: number,
  ) {
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

  async findOneById(id: number) {
    const query = {
      id,
      deletedAt: null,
    } as unknown as any;
    const match = await this.repository.findOneBy(query);
    if (!match) throw new NotFoundException();
    return match;
  }
  async findOneBy(query: FindOptionsWhere<T>) {
    return await this.repository.findOneBy({
      ...query,
      deletedAt: null,
    });
  }
  async findOneByOrFail(query: FindOptionsWhere<T>) {
    const match = await this.repository.findOneBy({
      ...query,
      deletedAt: null,
    });
    if (!match) throw new NotFoundException();
    return match;
  }
  async list(
    findOptionsWhere: FindOptionsWhere<T> = {},
    findOptionsOrder: FindOptionsOrder<T> = {},
  ) {
    return await this.repository.find({
      where: {
        ...findOptionsWhere,
        deletedAt: null,
      },
      order: findOptionsOrder,
    });
  }

  async listOne(
    findOptionsWhere: FindOptionsWhere<T> = {},
    findOptionsOrder: FindOptionsOrder<T> = {},
  ) {
    return await this.repository.findOne({
      where: { ...findOptionsWhere, deletedAt: null },
      order: findOptionsOrder,
    });
  }

  async create(createDto: Partial<T>) {
    try {
      const entity = this.repository.create(createDto as DeepPartial<T>);
      return await this.repository.save(entity);
    } catch (error) {
      if (error?.code === PostgresErrorCode.ForeignKeyViolation) {
        throw new RelationDoNotExistsException();
      }
      throw error;
    }
  }

  async update(id: number, updateDto: Partial<T>) {
    const query = { id, deletedAt: null } as unknown as any;
    const entity = await this.repository.update(
      query,
      updateDto as unknown as QueryDeepPartialEntity<T>,
    );
    return entity;
  }

  async updateBy(query: any, updateDto: Partial<T>) {
    const entity = await this.repository.update(
      {
        ...query,
        deletedAt: null,
      },
      updateDto as unknown as QueryDeepPartialEntity<T>,
    );
    return entity;
  }

  async remove(id: number): Promise<UpdateResult> {
    return await this.repository.update(id, {
      deletedAt: new Date(),
    } as unknown as QueryDeepPartialEntity<T>);
  }

  async removeBy(query: FindOptionsWhere<T>): Promise<UpdateResult> {
    if (!query)
      throw new BadRequestException('YOU CANNOT DELETE THE WHOLE TABLE');
    return await this.updateBy(query, {
      deletedAt: new Date(),
    } as unknown as Partial<T>);
  }

  getQueryBuilder(alias: string) {
    return this.repository.createQueryBuilder(alias);
  }
}
