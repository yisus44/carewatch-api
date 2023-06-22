import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { FileTypeService } from './file-type.service';
import { CreateFileTypeDto } from './dto/create-file-type.dto';
import { UpdateFileTypeDto } from './dto/update-file-type.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('file-type')
export class FileTypeController {
  constructor(private readonly fileTypeService: FileTypeService) {}

  @Post()
  create(@Body() createFileTypeDto: CreateFileTypeDto) {
    return this.fileTypeService.create(createFileTypeDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.fileTypeService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.fileTypeService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFileTypeDto: UpdateFileTypeDto,
  ) {
    return this.fileTypeService.update(+id, updateFileTypeDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.fileTypeService.remove(+id);
  }
}
