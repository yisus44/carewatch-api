import { IsNotEmpty, IsPositive } from 'class-validator';

export class CreateGroupFileDto {
  @IsNotEmpty()
  @IsPositive()
  groupId: number;

  @IsNotEmpty()
  @IsPositive()
  fileId: number;
}