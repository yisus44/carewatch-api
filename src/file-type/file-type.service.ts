import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateFileTypeDto } from './dto/update-file-type.dto';
import { FileType } from './entities/file-type.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CoreService } from '../core/core.service';

@Injectable()
export class FileTypeService extends CoreService<FileType> {
  constructor(
    @InjectRepository(FileType)
    private fileTypeRepository: Repository<FileType>,
  ) {
    super(fileTypeRepository);
  }
}
