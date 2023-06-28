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

@Injectable()
export class FileTypeService {
  constructor(
    @InjectRepository(FileType)
    private fileTypeRepository: Repository<FileType>,
  ) {}
  async findAll(paginationDto: PaginationDto): Promise<PageDto<FileType[]>> {
    const { page, perPage } = paginationDto;
    const skippedItems = (page - 1) * perPage;
    const [data, totalCount] = await this.fileTypeRepository.findAndCount({
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

  async findOne(id: number): Promise<FileType | null> {
    const file = await this.fileTypeRepository.findOneBy({ id });
    if (!file) throw new NotFoundException();
    return file;
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.fileTypeRepository.delete(id);
  }

  async update(id: number, updateFileTypeDto: UpdateFileTypeDto) {
    const file = await this.fileTypeRepository.update(
      { id },
      updateFileTypeDto,
    );
    return file;
  }
  async create(createFileTypeDto: CreateFileTypeDto): Promise<FileType> {
    try {
      const file = this.fileTypeRepository.create(createFileTypeDto);
      return await this.fileTypeRepository.save(file);
    } catch (error) {
      if (error?.code === PostgresErrorCode.ForeignKeyViolation) {
        throw new BadRequestException('FileType type do not exist');
      }
      throw error;
    }
  }
}
