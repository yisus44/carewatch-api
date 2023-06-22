import { PartialType } from '@nestjs/mapped-types';
import { CreateFileTypeDto } from './create-file-type.dto';

export class UpdateFileTypeDto extends PartialType(CreateFileTypeDto) {}
