import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class PaginateGroupDto extends PaginationDto {
  @IsNotEmpty()
  @IsPositive()
  @Type(() => Number)
  groupId: number;
}
