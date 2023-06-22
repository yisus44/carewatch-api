import { Module } from '@nestjs/common';
import { FileTypeService } from './file-type.service';
import { FileTypeController } from './file-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileType } from './entities/file-type.entity';

import { FileTypeRepository } from './file-type.repository';
import { TypeORMAdapter } from 'src/common/repo/typeOrmAdapter';

@Module({
  controllers: [FileTypeController],
  providers: [FileTypeService],
  imports: [TypeOrmModule.forFeature([FileType])],
  exports: [TypeOrmModule, FileTypeService],
})
export class FileTypeModule {}
