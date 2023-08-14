import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AdminGuard } from './guards/admin.guard';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { InvitateUsersToGroup } from './dto/invitate-users-to-group.dto';
import { GroupInvitationsService } from './group-invitations.service';
import { Permissions } from './decorators/permission.decorator';
import { Permission } from './enums/permission.enum';
@UseGuards(AuthGuard)
@Controller('group-invitations')
export class GroupInvitationsController {
  constructor(
    private readonly groupInvitationService: GroupInvitationsService,
  ) {}

  @Permissions(Permission.writePermissionMedicine)
  @Post('demo')
  demo() {
    return 'executed';
  }
  @UseGuards(AuthGuard, AdminGuard)
  @Post('invite')
  inviteUsersToGroup(@Body() invitateUsersToGroup: InvitateUsersToGroup) {
    return this.groupInvitationService.inviteUsersToGroup(invitateUsersToGroup);
  }
}
