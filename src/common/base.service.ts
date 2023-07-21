import { User } from 'aws-sdk/clients/budgets';
import { PaginationDto } from './dto/pagination.dto';
import { FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { PageDto } from './dto/page.dto';

export abstract class BaseService<T> {
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

  async list(
    findOptionsWhere: FindOptionsWhere<T> = {},
    findOptionsOrder: FindOptionsOrder<T> = {},
  ) {
    return await this.repository.find({
      where: findOptionsWhere,
      order: findOptionsOrder,
    });
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
