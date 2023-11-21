import { PaginationDto } from '../common/dto/pagination.dto';
import {
  DeepPartial,
  DeleteResult,
  EntityPropertyNotFoundError,
  FindOptionsOrder,
  FindOptionsWhere,
  IsNull,
  Not,
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
        deletedAt: IsNull(),
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
      deletedAt: IsNull(),
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
      deletedAt: IsNull(),
    });
    if (!match) throw new NotFoundException();
    return match;
  }
  async list(
    findOptionsWhere: FindOptionsWhere<T> = {},
    findOptionsOrder: FindOptionsOrder<T> = {},
    includeSoftDeletes = false,
  ) {
    if (!includeSoftDeletes)
      findOptionsWhere = { ...findOptionsWhere, deletedAt: IsNull() };
    return await this.repository.find({
      where: findOptionsWhere,
      order: findOptionsOrder,
    });
  }

  getUnique(list: T[]) {
    const seen = new Set();
    return list.filter((obj) => {
      const value = obj.id;
      if (!seen.has(value)) {
        seen.add(value);
        return true;
      }
      return false;
    });
  }
  async listOne(
    findOptionsWhere: FindOptionsWhere<T> = {},
    findOptionsOrder: FindOptionsOrder<T> = {},
  ) {
    return await this.repository.findOne({
      where: { ...findOptionsWhere, deletedAt: IsNull() },
      order: findOptionsOrder,
    });
  }

  async batchCreate(entities: Partial<T>[]) {
    const promiseArr = [];
    if (!entities) return;
    for (const entity of entities) {
      delete entity.id;
      promiseArr.push(this.create(entity));
    }
    await Promise.all(promiseArr);
  }

  async batchUpdate(entities: Partial<T>[]) {
    const promiseArr = [];
    if (!entities) return;
    for (const entity of entities) {
      // const found = await this.findOneById(entity.id);
      // //if the user tries to update an non existent identity
      // if (!found) continue;

      promiseArr.push(this.update(entity.id, entity));
    }
    await Promise.all(promiseArr);
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
    try {
      if (!id) throw new BadRequestException('id not provided');
      const query = {
        id,
        deletedAt: IsNull(),
      } as unknown as FindOptionsWhere<T>;
      delete updateDto.id;

      const entity = await this.repository.update(
        query,
        updateDto as unknown as QueryDeepPartialEntity<T>,
      );
      return entity;
    } catch (error) {
      if (error instanceof EntityPropertyNotFoundError) {
        throw new BadRequestException(
          `You somehow send fields to update that are not in the model, ${error.message}`,
        );
      }
      throw error;
    }
  }

  async updateBy(query: any, updateDto: Partial<T>) {
    const entity = await this.repository.update(
      {
        ...query,
        deletedAt: IsNull(),
      },
      updateDto as unknown as QueryDeepPartialEntity<T>,
    );
    return entity;
  }

  async remove(id: number): Promise<UpdateResult> {
    return await this.repository.update(id, {
      deletedAt: () => 'now()',
    } as unknown as QueryDeepPartialEntity<T>);
  }

  async removeBy(query: FindOptionsWhere<T>): Promise<UpdateResult> {
    if (!query)
      throw new BadRequestException('YOU CANNOT DELETE THE WHOLE TABLE');
    return await this.updateBy(query, {
      deletedAt: () => 'now()',
    } as unknown as Partial<T>);
  }

  async getBatch(ids: number[]) {
    const queryBuilder = this.getQueryBuilder('groups');
    return await queryBuilder.where(`id IN (:...ids)`, { ids }).getMany();
  }
  async getBatchOfDifferentKey(ids: number[], key: string) {
    const queryBuilder = this.getQueryBuilder('groups');
    return await queryBuilder
      .where(`{key} IN (:...ids)`, { ids, key })
      .getMany();
  }
  getQueryBuilder(alias: string) {
    return this.repository.createQueryBuilder(alias);
  }
}
