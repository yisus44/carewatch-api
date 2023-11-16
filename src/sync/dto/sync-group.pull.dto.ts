import { IsDate, IsNotEmpty } from 'class-validator';

export class PullSyncDto {
  @IsNotEmpty()
  syncGroups: SyncGroupDto[];
  @IsNotEmpty()
  baseSyncDate: Date;
}

export class SyncGroupDto {
  @IsNotEmpty()
  groupId: number;

  @IsNotEmpty()
  @IsDate()
  syncDate: Date;
}
