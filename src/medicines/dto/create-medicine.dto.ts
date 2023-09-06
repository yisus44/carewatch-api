import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMedicineDto {
  @IsNotEmpty()
  @IsInt()
  medicineUnitId: number;

  @IsInt()
  @IsNotEmpty()
  groupId: number;

  @IsInt()
  @IsOptional()
  photoId: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  @IsNotEmpty()
  quantity: number;

  @IsInt()
  @IsNotEmpty()
  currentQuantity: number;

  @IsInt()
  @IsNotEmpty()
  lowMedicineThreshold: number;
}
