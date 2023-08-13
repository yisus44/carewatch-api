import {
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Min,
} from 'class-validator';

export class SearchGroupInvitationDto {
  @IsNotEmpty()
  @IsNumberString()
  groupId: number;

  @IsNotEmpty()
  @IsString()
  term: string;
}
