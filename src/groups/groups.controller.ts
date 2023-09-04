import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ForbiddenException,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { GetCurrentUser } from '../auth/decorators/current-user';
import { User } from '../users/entities/user.entity';
import { MailInvitation } from './dto/mail-invitation.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { AdminGuard } from '../user-groups/guards/admin.guard';
import { InvitateUsersToGroup } from '../user-groups/dto/invitate-users-to-group.dto';

@UseGuards(AuthGuard)
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  create(
    @Body() createGroupDto: CreateGroupDto,
    @GetCurrentUser() currentUser: User,
  ) {
    return this.groupsService.add(createGroupDto, currentUser);
  }

  @Get()
  findAll(
    @Query() paginationDto: PaginationDto,
    @GetCurrentUser() currentUser: User,
  ) {
    return this.groupsService.getUserGroups(paginationDto, currentUser);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.groupsService.findOneById(id);
  }

  @UseGuards(AdminGuard)
  @Patch()
  update(@Query('groupId') id: number, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupsService.update(id, updateGroupDto);
  }

  @UseGuards(AdminGuard)
  @Delete()
  remove(@Query('groupId') id: number) {
    return this.groupsService.remove(+id);
  }

  @UseGuards(AdminGuard)
  @Post('invite')
  inviteUsersToGroup(
    @Body() invitateUsersToGroup: InvitateUsersToGroup,
    @Query('groupId') id: number,
    @GetCurrentUser() currentUser: User,
  ) {
    return this.groupsService.inviteUsersToGroup(
      {
        ...invitateUsersToGroup,
        groupId: id,
      },
      currentUser,
    );
  }
}
