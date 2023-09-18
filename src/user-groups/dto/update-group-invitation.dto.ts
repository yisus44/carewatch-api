import { PartialType } from '@nestjs/mapped-types';
import { CreateUserGroupDto } from './create-group-invitation.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateUserGroupDto extends PartialType(CreateUserGroupDto) {
  @IsOptional()
  @IsBoolean()
  readPermissionReminder: boolean;

  @IsOptional()
  @IsBoolean()
  writePermissionReminder: boolean;

  @IsOptional()
  @IsBoolean()
  editPermissionReminder: boolean;

  @IsOptional()
  @IsBoolean()
  deletePermissionReminder: boolean;

  @IsOptional()
  @IsBoolean()
  readPermissionFile: boolean;

  @IsOptional()
  @IsBoolean()
  uploadPermissionFile: boolean;

  @IsOptional()
  @IsBoolean()
  deletePermissionFile: boolean;

  @IsOptional()
  @IsBoolean()
  readPermissionMedicine: boolean;

  @IsOptional()
  @IsBoolean()
  writePermissionMedicine: boolean;

  @IsOptional()
  @IsBoolean()
  emailCommunication: boolean;

  @IsOptional()
  @IsBoolean()
  whatsAppCommunication: boolean;

  @IsOptional()
  @IsBoolean()
  carewatchCommunication: boolean;
}
