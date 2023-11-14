import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSmartwatchDto {
  @IsNotEmpty()
  @IsString()
  tokenAccount: string;

  @IsNotEmpty()
  userGroupId: number;

  @IsNotEmpty()
  @IsString()
  smartwatchName: string;

  @IsNotEmpty()
  @IsString()
  smartwatchToken: string;

  @IsNotEmpty()
  isConnected: boolean;
}
