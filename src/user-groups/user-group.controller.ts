import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from './guards/admin.guard';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { InvitateUsersToGroup } from './dto/invitate-users-to-group.dto';
import { UserGroupService } from './user-group.service';
import { Permissions } from './decorators/permission.decorator';
import { Permission } from './enums/permission.enum';
import { MemberGuard } from './guards/member.guard';
import { GetCurrentUser } from 'src/auth/decorators/current-user';
import { User } from 'aws-sdk/clients/budgets';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginateGroupDto } from './dto/paginate-group.dto';
@UseGuards(AuthGuard)
@Controller('user-groups')
export class UserGroupsController {
  constructor(private readonly userGroupService: UserGroupService) {}

  @Permissions(Permission.writePermissionMedicine)
  @Post('demo')
  demo() {
    return 'executed';
  }

  @UseGuards(MemberGuard)
  @Get('members')
  async getMemembers(
    @GetCurrentUser() user: User,
    @Query() paginateGroupDto: PaginateGroupDto,
  ) {
    return await this.userGroupService.findPaginated(paginateGroupDto, {
      groupId: paginateGroupDto.groupId,
    });
  }
  @UseGuards(AuthGuard, AdminGuard)
  @Post('invite')
  inviteUsersToGroup(@Body() invitateUsersToGroup: InvitateUsersToGroup) {
    return this.userGroupService.inviteUsersToGroup(invitateUsersToGroup);
  }
}
