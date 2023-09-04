import { Type } from 'class-transformer';
import { IsNotEmpty, IsPositive } from 'class-validator';
import { PaginateGroupDto } from '../../user-groups/dto/paginate-group.dto';

export class PaginateReminderDto extends PaginateGroupDto {
  @IsNotEmpty()
  @IsPositive()
  @Type(() => Number)
  reminderId: number;
}
