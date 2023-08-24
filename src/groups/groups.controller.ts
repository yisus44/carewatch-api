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
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { GetCurrentUser } from 'src/auth/decorators/current-user';
import { User } from 'src/users/entities/user.entity';
import { MailInvitation } from './dto/mail-invitation.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AdminGuard } from 'src/user-groups/guards/admin.guard';
import { InvitateUsersToGroup } from 'src/user-groups/dto/invitate-users-to-group.dto';

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
  findOne(@Param('id') id: number, @GetCurrentUser() currentUser: User) {
    return this.groupsService.findOneById(id);
  }

  @UseGuards(AdminGuard)
  @Patch(':id')
  update(
    @Query('id') id: number,
    @Body() updateGroupDto: UpdateGroupDto,
    @GetCurrentUser() currentUser: User,
  ) {
    return this.groupsService.update(id, updateGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number, @GetCurrentUser() currentUser: User) {
    return this.groupsService.remove(+id);
  }

  @UseGuards(AdminGuard)
  @Post('invite')
  inviteUsersToGroup(
    @Body() invitateUsersToGroup: InvitateUsersToGroup,
    @GetCurrentUser() currentUser: User,
  ) {
    return this.groupsService.inviteUsersToGroup(
      invitateUsersToGroup,
      currentUser,
    );
  }
}
