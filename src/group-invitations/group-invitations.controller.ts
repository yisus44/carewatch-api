import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AdminGuard } from './guards/admin.guard';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { InvitateUsersToGroup } from './dto/invitate-users-to-group.dto';
import { GroupInvitationsService } from './group-invitations.service';

@Controller('group-invitations')
export class GroupInvitationsController {
  constructor(
    private readonly groupInvitationService: GroupInvitationsService,
  ) {}

  @UseGuards(AuthGuard, AdminGuard)
  @Post('invite')
  inviteUsersToGroup(@Body() invitateUsersToGroup: InvitateUsersToGroup) {
    return this.groupInvitationService.inviteUsersToGroup(invitateUsersToGroup);
  }
}
