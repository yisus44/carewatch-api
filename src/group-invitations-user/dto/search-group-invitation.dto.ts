import {
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Min,
} from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class SearchGroupInvitationDto extends PaginationDto {
  @IsNotEmpty()
  @IsNumberString()
  groupId: number;

  @IsNotEmpty()
  @IsString()
  term: string;
}
