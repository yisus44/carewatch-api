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

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
  ) {}
  async findAll(paginationDto: PaginationDto): Promise<PageDto<File[]>> {
    const { page, perPage } = paginationDto;
    const skippedItems = (page - 1) * perPage;
    const [data, totalCount] = await this.fileRepository.findAndCount({
      skip: skippedItems,
      take: perPage,
    });
    const totalPages = Math.ceil(totalCount / perPage);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;
    return {
      data,
      page,
      perPage,
      totalPages,
      hasNextPage,
      hasPreviousPage,
    };
  }

  async findOne(id: number): Promise<File | null> {
    const file = await this.fileRepository.findOneBy({ id });
    if (!file) throw new NotFoundException();
    return file;
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.fileRepository.delete(id);
  }

  async update(id: number, updateFileDto: UpdateFileDto) {
    const file = await this.fileRepository.update({ id }, updateFileDto);
    return file;
  }
  async create(createFileTypeDto: CreateFileDto): Promise<File> {
    try {
      const file = this.fileRepository.create(createFileTypeDto);
      return await this.fileRepository.save(file);
    } catch (error) {
      if (error?.code === PostgresErrorCode.ForeignKeyViolation) {
        throw new BadRequestException('File type do not exist');
      }
      throw error;
    }
  }
}
