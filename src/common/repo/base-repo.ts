import { Repository } from 'typeorm';
import { IRepo } from './IRepo';
import { PaginationDto } from '../dto/pagination.dto';

export abstract class BaseRepository<T> implements IRepo<T> {
  constructor(private readonly repository: Repository<T>) {}

  async create(data: any): Promise<T> {
    const entity = this.repository.create(data);
    return (await this.repository.save(entity)) as T;
  }

  async findOne(id: any): Promise<T> {
    return this.repository.findOneBy({
      //@ts-ignore
      id,
    });
  }
  async find(paginationDto: PaginationDto): Promise<T[]> {
    const { page, perPage } = paginationDto;
    const skippedItems = (page - 1) * perPage;
    const [data, totalCount] = await this.repository.findAndCount({
      skip: skippedItems,
      where: {},
      order: {},
      take: perPage,
    });
    const totalPages = Math.ceil(totalCount / perPage);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;
    return data;
  }

  async update(id: number, data: Partial<T>): Promise<T> {
    await this.repository.update(id, data as Partial<unknown>);
    return await this.findOne(id);
  }

  async delete(id: number): Promise<T> {
    await this.repository.delete(id);
    return await this.findOne(id);
  }
}
