import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateMedicineDto {
  @IsNotEmpty()
  @IsInt()
  medicineUnitId: number;

  @IsInt()
  @IsNotEmpty()
  groupId: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  @IsNotEmpty()
  quantity: string;

  @IsInt()
  @IsNotEmpty()
  currentQuantity: number;

  @IsInt()
  @IsNotEmpty()
  lowMedicineThreshold: number;
}
