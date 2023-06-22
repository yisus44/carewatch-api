import { CreateFileTypeDto } from 'src/file-type/dto/create-file-type.dto';
import { FileType } from 'src/file-type/entities/file-type.entity';
import { CreateFileDto } from 'src/files/dto/create-file.dto';

export const fileTypeData: CreateFileTypeDto[] = [
  {
    type: 'PNG',
  },
  {
    type: 'JPEG',
  },
  {
    type: 'MP3',
  },
  {
    type: 'MP4',
  },
];
