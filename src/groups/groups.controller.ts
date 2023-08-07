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
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { GetCurrentUser } from 'src/auth/decorators/current-user';
import { User } from 'src/users/entities/user.entity';
import { MailInvitation } from './dto/mail-invitation.dto';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(
    @Body() createGroupDto: CreateGroupDto,
    @GetCurrentUser() currentUser: User,
  ) {
    return this.groupsService.add(createGroupDto, currentUser);
  }

  @UseGuards(AuthGuard)
  @Post(':id/invitation-mail')
  inviteByMail(
    @Param('id', ParseIntPipe) groupId: number,
    @Body() mailInvitation: MailInvitation,
  ) {
    return this.groupsService.inviteByMail(mailInvitation.guestEmail, groupId);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@GetCurrentUser() currentUser: User) {
    return this.groupsService.findPaginated();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number, @GetCurrentUser() currentUser: User) {
    return this.groupsService.findOneById(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateGroupDto: UpdateGroupDto,
    @GetCurrentUser() currentUser: User,
  ) {
    return this.groupsService.update(id, updateGroupDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number, @GetCurrentUser() currentUser: User) {
    return this.groupsService.remove(+id);
  }
}
