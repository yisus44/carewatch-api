import { Injectable } from '@nestjs/common';
import { FindOptionsOrder, FindOptionsWhere } from 'typeorm';

export interface QueryFieldAdapter<T> {
  queryFields(filter: Partial<T>, sort: SortOptionsAdapter<T>): Result<T>;
}
export interface SortOptionsAdapter<T> {
  order: SortOptions;
  field: keyof T;
}
export interface Result<T> {
  whereClause: FindOptionsWhere<T>;
  sortClause: FindOptionsOrder<T>;
}

export enum SortOptions {
  ASC = 'ASC',
  DESC = 'DESC',
}

@Injectable()
export class TypeORMAdapter<Entity> implements QueryFieldAdapter<Entity> {
  queryFields(
    filter: Partial<Entity>,
    // sort: SortOptionsAdapter<Entity>,
  ): Result<Entity> {
    const whereClause: FindOptionsWhere<Entity> = {};
    const sortClause: FindOptionsOrder<Entity> = {};

    // Generate the "where" clause based on the filter criteria
    for (const property in filter) {
      if (filter.hasOwnProperty(property)) {
        // @ts-ignore
        whereClause[property.toString()] = filter[property];
      }
    }

    return { whereClause, sortClause };
  }
}
