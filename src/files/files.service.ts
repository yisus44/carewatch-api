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
import { PostgresErrorCode } from '../database/postgresErrorCodes.enum';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PageDto } from '../common/dto/page.dto';
import { CoreService } from '../core/core.service';

@Injectable()
export class FilesService extends CoreService<File> {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
  ) {
    super(fileRepository);
  }
  async batchCreate(entities: Partial<File>[]) {
    const promiseArr = [];
    if (!entities) return;
    for (const entity of entities) {
      delete entity.id;
      promiseArr.push(this.create(entity as File));
    }
    await Promise.all(promiseArr);
  }
  async batchUpdate(entities: Partial<File>[]) {
    const promiseArr = [];
    if (!entities) return;
    for (const entity of entities) {
      promiseArr.push(this.update(entity.id, entity));
    }
    await Promise.all(promiseArr);
  }
}
