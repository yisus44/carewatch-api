import { User } from 'aws-sdk/clients/budgets';
import { PaginationDto } from '../common/dto/pagination.dto';
import {
  DeepPartial,
  DeleteResult,
  FindOptionsOrder,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { PageDto } from '../common/dto/page.dto';
import { CoreEntity } from './entities/core-entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PostgresErrorCode } from 'src/database/postgresErrorCodes.enum';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

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
      where: findOptionsWhere,
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
    } as unknown as any;
    const match = await this.repository.findOneBy(query);
    if (!match) throw new NotFoundException();
    return match;
  }

  async list(
    findOptionsWhere: FindOptionsWhere<T> = {},
    findOptionsOrder: FindOptionsOrder<T> = {},
  ) {
    return await this.repository.find({
      where: findOptionsWhere,
      order: findOptionsOrder,
    });
  }

  async listOne(
    findOptionsWhere: FindOptionsWhere<T> = {},
    findOptionsOrder: FindOptionsOrder<T> = {},
  ) {
    return await this.repository.findOne({
      where: findOptionsWhere,
      order: findOptionsOrder,
    });
  }

  async create(createDto: Partial<T>) {
    try {
      const entity = this.repository.create(createDto as DeepPartial<T>);
      return await this.repository.save(entity);
    } catch (error) {
      if (error?.code === PostgresErrorCode.ForeignKeyViolation) {
        throw new BadRequestException('Relation do not exist');
      }
      throw error;
    }
  }

  async update(id: any, updateDto: Partial<T>) {
    const file = await this.repository.update(
      { id },
      updateDto as unknown as QueryDeepPartialEntity<T>,
    );
    return file;
  }
  async remove(id: number): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }

  getQueryBuilder(alias: string) {
    return this.repository.createQueryBuilder(alias);
  }
}
