import { Module } from '@nestjs/common';
import { GroupFilesService } from './group-files.service';
import { GroupFilesController } from './group-files.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupFile } from './entities/group-file.entity';

@Module({
  controllers: [GroupFilesController],
  providers: [GroupFilesService],
  imports: [TypeOrmModule.forFeature([GroupFile])],
  exports: [GroupFilesService],
})
export class GroupFilesModule {}
