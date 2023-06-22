import { Repository } from 'typeorm';
import { FileType } from './entities/file-type.entity';

import { BaseRepository } from 'src/common/repo/base-repo';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IRepo } from 'src/common/repo/IRepo';
import { QueryFieldAdapter } from 'src/common/repo/typeOrmAdapter';

@Injectable()
export class FileTypeRepository
  extends BaseRepository<FileType>
  implements IRepo<FileType>
{
  constructor(@InjectRepository(FileType) repository: Repository<FileType>) {
    super(repository);
  }
}
