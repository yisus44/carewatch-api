import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateFileTypeDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  type: string;
}
