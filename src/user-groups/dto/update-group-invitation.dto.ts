import { PartialType } from '@nestjs/mapped-types';
import { CreateUserGroupDto } from './create-group-invitation.dto';

export class UpdateUserGroupDto extends PartialType(CreateUserGroupDto) {}
