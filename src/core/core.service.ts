import { User } from 'aws-sdk/clients/budgets';
import { PaginationDto } from '../common/dto/pagination.dto';
import {
  DeleteResult,
  FindOptionsOrder,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { PageDto } from '../common/dto/page.dto';
import { CoreEntity } from './entities/core-entity';

export abstract class CoreService<T extends CoreEntity> {
  constructor(private readonly repository: Repository<T>) {}

  async findPaginated(
    paginationDto: PaginationDto = { page: 1, perPage: 10 },
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

  async findOneById(id: any) {
    return await this.repository.findOneBy({
      id,
    });
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

  async delete(id: number): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }
}
