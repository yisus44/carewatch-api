import {
  Body,
  Controller,
  Delete,
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
    @Query() paginationDto: PaginationDto,
  ) {
    return await this.userGroupService.findPaginated(paginationDto, {
      userId: user.id,
      isActive: false,
    });
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateUserGroupDto: UpdateUserGroupDto,
    @Query('groupId') groupId: number,
  ) {
    const sanitizedUpate =
      this.userGroupService.sanitizeUserUpdate(updateUserGroupDto);
    return await this.userGroupService.update(id, {
      ...sanitizedUpate,
      groupId,
    });
  }

  @UseGuards(AuthGuard)
  @Patch(':id/me')
  async updateMe(
    @Param('id') id: number,
    @Body() updateUserGroupDto: UpdateUserGroupDto,
    @Query('groupId') groupId: number,
    @GetCurrentUser() user: User,
  ) {
    const sanitizedUpate =
      this.userGroupService.sanitizeUserUpdate(updateUserGroupDto);
    const sanitizeFromPermissionUpdate =
      this.userGroupService.sanitizeUserUpdatePermission(sanitizedUpate);

    return await this.userGroupService.updateBy(
      { id, userId: user.id, groupId },
      {
        ...sanitizeFromPermissionUpdate,
      },
    );
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Delete(':id')
  async delete(@Param('id') id: number, @Query('groupId') groupId: number) {
    return await this.userGroupService.removeBy({ id, groupId });
  }

  @UseGuards(AuthGuard)
  @Delete(':id/me')
  async deleteUnwantedInvitation(
    @Param('id') id: number,
    @GetCurrentUser() user: User,
  ) {
    return await this.userGroupService.removeBy({ id, userId: user.id });
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
