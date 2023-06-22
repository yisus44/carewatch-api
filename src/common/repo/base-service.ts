import { PaginationDto } from '../dto/pagination.dto';
import { BaseRepository } from './base-repo';
import { QueryFieldAdapter, TypeORMAdapter } from './typeOrmAdapter';

export abstract class BaseService<T> {
  constructor(
    private readonly repository: BaseRepository<T>,
    private readonly typeOrmAdapter: TypeORMAdapter<T>,
  ) {}

  async findAll(paginationDto: PaginationDto): Promise<T[]> {
    //@ts-ignore
    const data = this.typeOrmAdapter.queryFields({ id: 'DROP TABLES' });
    return await this.repository.find(paginationDto);
  }

  async findOne(id: any): Promise<T> {
    return await this.repository.findOne(id);
  }

  async create(data: any): Promise<T> {
    return this.repository.create(data);
  }

  async update(id: number, data: any): Promise<T> {
    await this.repository.update(id, data);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
