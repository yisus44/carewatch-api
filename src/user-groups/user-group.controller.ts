import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from './guards/admin.guard';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UserGroupService } from './user-group.service';
import { Permissions } from './decorators/permission.decorator';
import { Permission } from './enums/permission.enum';
import { MemberGuard } from './guards/member.guard';
import { GetCurrentUser } from '../auth/decorators/current-user';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginateGroupDto } from './dto/paginate-group.dto';
import { UpdateUserGroupDto } from './dto/update-group-invitation.dto';
import { User } from '../users/entities/user.entity';

@Controller('user-groups')
export class UserGroupsController {
  constructor(private readonly userGroupService: UserGroupService) {}

  @UseGuards(AuthGuard)
  @Permissions(Permission.writePermissionMedicine)
  @Post('demo')
  demo() {
    return 'executed';
  }

  @UseGuards(AuthGuard, MemberGuard)
  @Get('members')
  async getMemembers(
    @GetCurrentUser() user: User,
    @Query() paginateGroupDto: PaginateGroupDto,
  ) {
    return await this.userGroupService.findPaginated(paginateGroupDto, {
      groupId: paginateGroupDto.groupId,
    });
  }

  @UseGuards(AuthGuard, MemberGuard)
  @Get('members/pending')
  async getMemembersPending(
    @GetCurrentUser() user: User,
    @Query() paginateGroupDto: PaginateGroupDto,
  ) {
    return await this.userGroupService.findPaginated(paginateGroupDto, {
      groupId: paginateGroupDto.groupId,
      isActive: false,
    });
  }

  @UseGuards(AuthGuard, MemberGuard)
  @Get('members/confirmed')
  async getMemembersConfirmed(
    @GetCurrentUser() user: User,
    @Query() paginateGroupDto: PaginateGroupDto,
  ) {
    return await this.userGroupService.findPaginated(paginateGroupDto, {
      groupId: paginateGroupDto.groupId,
      isActive: true,
    });
  }

  @UseGuards(AuthGuard)
  @Get('members/me')
  async getMyInvitations(
    @GetCurrentUser() user: User,
    @Query() paginateGroupDto: PaginateGroupDto,
  ) {
    return await this.userGroupService.findPaginated(paginateGroupDto, {
      userId: user.id,
      isActive: false,
    });
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Param() id: number,
    @Body() updateUserGroupDto: UpdateUserGroupDto,
  ) {
    return await this.userGroupService.update(id, updateUserGroupDto);
  }

  @Patch(':token/accept')
  async acceptInvitation(
    @Param('token') token: string,
    @Body() updateUserGroupDto: UpdateUserGroupDto,
  ) {
    delete updateUserGroupDto.groupId;

    return await this.userGroupService.updateBy(
      { token },
      { ...updateUserGroupDto, isActive: true },
    );
  }
}
