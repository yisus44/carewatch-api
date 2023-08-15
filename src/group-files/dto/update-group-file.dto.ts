import { PartialType } from '@nestjs/mapped-types';
import { CreateGroupFileDto } from './create-group-file.dto';

export class UpdateGroupFileDto extends PartialType(CreateGroupFileDto) {}
