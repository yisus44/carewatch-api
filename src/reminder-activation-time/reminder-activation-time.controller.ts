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
import { ReminderActivationTimeService } from './reminder-activation-time.service';
import { CreateReminderActivationTimeDto } from './dto/create-reminder-activation-time.dto';
import { UpdateReminderActivationTimeDto } from './dto/update-reminder-activation-time.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { MemberGuard } from 'src/user-groups/guards/member.guard';
import { PaginateGroupDto } from 'src/user-groups/dto/paginate-group.dto';

@Controller('reminder-activation-time')
export class ReminderActivationTimeController {
  constructor(
    private readonly reminderActivationTimeService: ReminderActivationTimeService,
  ) {}

  @Post()
  create(
    @Body() createReminderActivationTimeDto: CreateReminderActivationTimeDto,
  ) {
    return this.reminderActivationTimeService.create(
      createReminderActivationTimeDto,
    );
  }
  @Get('/reminder/:reminderId')
  findAllActivationTimeOfReminder(
    @Param('reminderId', ParseIntPipe) reminderId: number,
    @Query() paginationDto: PaginateGroupDto,
  ) {
    return this.reminderActivationTimeService.findPaginated(paginationDto, {
      reminderId,
    });
  }

  @Get()
  findAll(@Query() paginationDto: PaginateGroupDto) {
    return this.reminderActivationTimeService.findPaginated(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reminderActivationTimeService.findOneById(+id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReminderActivationTimeDto: UpdateReminderActivationTimeDto,
  ) {
    return this.reminderActivationTimeService.update(
      +id,
      updateReminderActivationTimeDto,
    );
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.reminderActivationTimeService.remove(+id);
  }
}
