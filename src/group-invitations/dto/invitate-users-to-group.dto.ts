import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class InvitateUsersToGroup {
  @IsNotEmpty()
  @IsNumber()
  groupId: number;

  @IsOptional()
  @IsArray()
  careWatchInvitation: CareWatchInvitation[];
}

class CareWatchInvitation {
  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
