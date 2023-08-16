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
} from '@nestjs/common';
import { RemindersService } from './reminders.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Permission } from 'src/user-groups/enums/permission.enum';
import { Permissions } from 'src/user-groups/decorators/permission.decorator';

@UseGuards(AuthGuard)
@Controller('reminders')
export class RemindersController {
  constructor(private readonly remindersService: RemindersService) {}

  @Permissions(Permission.writePermissionReminder)
  @Post()
  create(@Body() createReminderDto: CreateReminderDto) {
    return this.remindersService.create(createReminderDto);
  }

  @Permissions(Permission.readPermissionReminder)
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.remindersService.findPaginated(paginationDto);
  }

  @Permissions(Permission.readPermissionReminder)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.remindersService.findOneById(+id);
  }

  @Permissions(Permission.editPermissionReminder)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateReminderDto: UpdateReminderDto,
  ) {
    return this.remindersService.update(+id, updateReminderDto);
  }

  @Permissions(Permission.deletePermissionReminder)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.remindersService.remove(+id);
  }
}
