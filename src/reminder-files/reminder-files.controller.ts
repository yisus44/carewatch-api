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
import { ReminderFilesService } from './reminder-files.service';
import { CreateReminderFileDto } from './dto/create-reminder-file.dto';
import { UpdateReminderFileDto } from './dto/update-reminder-file.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Permissions } from 'src/user-groups/decorators/permission.decorator';
import { Permission } from 'src/user-groups/enums/permission.enum';
import { PaginateReminderDto } from 'src/reminders/dto/paginate-reminder.dto';

@UseGuards(AuthGuard)
@Controller('reminder-files')
export class ReminderFilesController {
  constructor(private readonly reminderFilesService: ReminderFilesService) {}

  @Post()
  @Permissions(Permission.uploadPermissionFile)
  create(
    @Query('groupId') groupId: number,
    @Body() createReminderFileDto: CreateReminderFileDto,
  ) {
    return this.reminderFilesService.create(createReminderFileDto);
  }

  @Permissions(Permission.readPermissionFile)
  @Get()
  findAll(@Query() paginateReminderDto: PaginateReminderDto) {
    return this.reminderFilesService.findPaginated(paginateReminderDto, {
      reminderId: paginateReminderDto.reminderId,
    });
  }

  @Permissions(Permission.readPermissionFile)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reminderFilesService.findOneBy({ id });
  }

  @Permissions(Permission.uploadPermissionFile)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReminderFileDto: UpdateReminderFileDto,
  ) {
    return this.reminderFilesService.updateBy({ id }, updateReminderFileDto);
  }

  @Permissions(Permission.deletePermissionFile)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.reminderFilesService.removeBy({ id });
  }
}
