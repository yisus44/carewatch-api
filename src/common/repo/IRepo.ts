import { PaginationDto } from '../dto/pagination.dto';

export interface IRepo<T> {
  create(data: any): Promise<T>;
  findOne(id: number): Promise<T>;
  find(paginationDto: PaginationDto): Promise<T[]>;
  update(id: number, data: Partial<T>): Promise<T>;
  delete(id: number): Promise<T>;
}
