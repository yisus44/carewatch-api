import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

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
