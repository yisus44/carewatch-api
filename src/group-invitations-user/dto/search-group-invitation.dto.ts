import {
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class SearchGroupInvitationDto extends PaginationDto {
  @IsNotEmpty()
  @IsNumberString()
  groupId: number;

  @IsOptional()
  @IsString()
  term: string = '';
}
