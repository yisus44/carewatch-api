import {
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Min,
} from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class SearchGroupInvitationDto extends PaginationDto {
  @IsNotEmpty()
  @IsNumberString()
  groupId: number;

  @IsNotEmpty()
  @IsString()
  term: string;
}
