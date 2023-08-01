import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateFileTypeDto } from './dto/update-file-type.dto';
import { FileType } from './entities/file-type.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { CreateFileTypeDto } from './dto/create-file-type.dto';
import { PostgresErrorCode } from 'src/database/postgresErrorCodes.enum';
import { CoreService } from 'src/core/core.service';

@Injectable()
export class FileTypeService extends CoreService<FileType> {
  constructor(
    @InjectRepository(FileType)
    private fileTypeRepository: Repository<FileType>,
  ) {
    super(fileTypeRepository);
  }
}
