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
  UseGuards,
} from '@nestjs/common';
import { GroupFilesService } from './group-files.service';
import { CreateGroupFileDto } from './dto/create-group-file.dto';
import { UpdateGroupFileDto } from './dto/update-group-file.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('group-files')
export class GroupFilesController {
  constructor(private readonly groupFilesService: GroupFilesService) {}

  @Post()
  create(@Body() createGroupFileDto: CreateGroupFileDto) {
    return this.groupFilesService.create(createGroupFileDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.groupFilesService.findPaginated(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.groupFilesService.findOneById(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGroupFileDto: UpdateGroupFileDto,
  ) {
    return this.groupFilesService.update(id, updateGroupFileDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.groupFilesService.remove(id);
  }
}
