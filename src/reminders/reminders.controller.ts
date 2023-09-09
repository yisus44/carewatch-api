import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { RemindersService } from './reminders.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Permission } from '../user-groups/enums/permission.enum';
import { Permissions } from '../user-groups/decorators/permission.decorator';
import { GetCurrentUser } from '../auth/decorators/current-user';
import { PaginateGroupDto } from '../user-groups/dto/paginate-group.dto';

@UseGuards(AuthGuard)
@Controller('reminders')
export class RemindersController {
  constructor(private readonly remindersService: RemindersService) {}

  @Permissions(Permission.writePermissionReminder)
  @Post()
  create(
    @Body() createReminderDto: CreateReminderDto,
    @Query('groupId', ParseIntPipe) groupId: number,
  ) {
    return this.remindersService.create({
      ...createReminderDto,
      groupId,
    });
  }

  @Permissions(Permission.readPermissionReminder)
  @Get()
  findAll(@Query() paginateGroupDto: PaginateGroupDto) {
    return this.remindersService.findPaginated(paginateGroupDto, {
      groupId: paginateGroupDto.groupId,
    });
  }

  @Permissions(Permission.readPermissionReminder)
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('groupId', ParseIntPipe) groupId: number,
  ) {
    return this.remindersService.findOneBy({ id, groupId });
  }

  @Permissions(Permission.editPermissionReminder)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReminderDto: UpdateReminderDto,
    @Query('groupId', ParseIntPipe) groupId: number,
  ) {
    return this.remindersService.updateBy({ id, groupId }, updateReminderDto);
  }

  @Permissions(Permission.deletePermissionReminder)
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Query('groupId', ParseIntPipe) groupId: number,
  ) {
    return this.remindersService.removeBy({ id, groupId });
  }
}
