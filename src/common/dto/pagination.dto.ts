import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  page: number = 1;
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  perPage: number = 10;
}
