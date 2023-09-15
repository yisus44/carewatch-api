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
import { PaginationDto } from '../common/dto/pagination.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Permissions } from '../user-groups/decorators/permission.decorator';
import { Permission } from '../user-groups/enums/permission.enum';
import { PaginateGroupDto } from '../user-groups/dto/paginate-group.dto';

@UseGuards(AuthGuard)
@Controller('group-files')
export class GroupFilesController {
  constructor(private readonly groupFilesService: GroupFilesService) {}

  @Permissions(Permission.uploadPermissionFile)
  @Post()
  async create(
    @Body() createGroupFileDto: CreateGroupFileDto,
    @Query('groupId', ParseIntPipe) groupId: number,
  ) {
    await this.groupFilesService.failIfFileExist(
      groupId,
      createGroupFileDto.fileId,
    );
    return this.groupFilesService.create({ ...createGroupFileDto, groupId });
  }

  @Permissions(Permission.readPermissionFile)
  @Get()
  findAll(@Query() paginateGroupDto: PaginateGroupDto) {
    return this.groupFilesService.findPaginated(paginateGroupDto, {
      groupId: paginateGroupDto.groupId,
    });
  }

  @Permissions(Permission.readPermissionFile)
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('groupId') groupId: number,
  ) {
    return this.groupFilesService.findOneByOrFail({ id, groupId });
  }

  @Permissions(Permission.uploadPermissionFile)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGroupFileDto: UpdateGroupFileDto,
    @Query('groupId') groupId: number,
  ) {
    await this.groupFilesService.failIfFileExist(
      groupId,
      updateGroupFileDto.fileId,
    );
    return this.groupFilesService.updateBy({ id, groupId }, updateGroupFileDto);
  }

  @Permissions(Permission.deletePermissionFile)
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Query('groupId') groupId: number,
  ) {
    return this.groupFilesService.removeBy({ id, groupId });
  }
}
