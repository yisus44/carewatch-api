import { IsNotEmpty, IsPositive } from 'class-validator';

export class CreateGroupFileDto {
  @IsNotEmpty()
  @IsPositive()
  fileId: number;
}
