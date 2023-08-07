import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { File } from './entities/file.entity';
import { PostgresErrorCode } from 'src/database/postgresErrorCodes.enum';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { CoreService } from 'src/core/core.service';

@Injectable()
export class FilesService extends CoreService<File> {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
  ) {
    super(fileRepository);
  }
}
