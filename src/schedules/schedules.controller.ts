import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { GetCurrentUser } from 'src/auth/decorators/current-user';
import { User } from 'src/users/entities/user.entity';
import { UserGroupService } from 'src/user-groups/user-group.service';
import { PaginateGroupDto } from 'src/user-groups/dto/paginate-group.dto';
import { MemberGuard } from 'src/user-groups/guards/member.guard';
import { UserNotFoundException } from 'src/common/exceptions/user-not-found.excepction';

@UseGuards(AuthGuard, MemberGuard)
@Controller('schedules')
export class SchedulesController {
  constructor(
    private readonly schedulesService: SchedulesService,
    private readonly userGroupService: UserGroupService,
  ) {}

  @Post()
  async create(
    @Body() createScheduleDto: CreateScheduleDto,
    @Query('groupId', ParseIntPipe) groupId: number,
    @GetCurrentUser() user: User,
  ) {
    const userGroup = await this.userGroupService.findOneBy({
      groupId: groupId,
      userId: user.id,
    });
    return this.schedulesService.create(createScheduleDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.schedulesService.findPaginated(paginationDto);
  }
  @Get('/me')
  async findMySchedules(
    @Query() paginationDto: PaginateGroupDto,
    @GetCurrentUser() user: User,
  ) {
    const userGroup = await this.userGroupService.findOneBy({
      groupId: paginationDto.groupId,
      userId: user.id,
    });
    return this.schedulesService.findPaginated(paginationDto, {
      userGroupId: userGroup.id,
    });
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('groupId', ParseIntPipe) groupId: number,
    @GetCurrentUser() user: User,
  ) {
    const userGroup = await this.validateRequest(groupId, user.id);
    return this.schedulesService.findOneBy({ userGroupId: userGroup.id, id });
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateScheduleDto: UpdateScheduleDto,
    @Query('groupId', ParseIntPipe) groupId: number,
    @GetCurrentUser() user: User,
  ) {
    const userGroup = await this.validateRequest(groupId, user.id);
    return this.schedulesService.updateBy(
      { id, userGroupId: userGroup.id },
      updateScheduleDto,
    );
  }

  async validateRequest(groupId: number, userId: number) {
    const userGroup = await this.userGroupService.findOneBy({
      groupId,
      userId,
    });
    if (!userGroup) throw new UserNotFoundException();
    return userGroup;
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Query('groupId', ParseIntPipe) groupId: number,
    @GetCurrentUser() user: User,
  ) {
    const userGroup = await this.validateRequest(groupId, user.id);
    return this.schedulesService.removeBy({ id, userGroupId: userGroup.id });
  }
}
