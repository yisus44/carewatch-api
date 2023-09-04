import { CreateFileTypeDto } from '../../file-type/dto/create-file-type.dto';
import { FileType } from '../../file-type/entities/file-type.entity';
import { CreateFileDto } from '../../files/dto/create-file.dto';

export const fileTypeData: CreateFileTypeDto[] = [
  {
    type: 'PNG',
  },
  {
    type: 'JPEG',
  },
  {
    type: 'JPG',
  },
  {
    type: 'MP3',
  },
  {
    type: 'MP4',
  },
];
