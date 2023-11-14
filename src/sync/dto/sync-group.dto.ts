import { IsNotEmpty } from 'class-validator';

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
  syncDate: Date;
}
