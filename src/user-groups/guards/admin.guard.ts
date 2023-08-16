import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { UserGroupService } from '../user-group.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { generateUserGroupCache } from '../utils/generate-user-invitation-cache-key.util';
import { UserGroup } from '../entities/group-invitation.entity';
import { GroupNotFoundException } from 'src/common/exceptions/group-not-found.exception';
import { UserNotInGroupException } from 'src/common/exceptions/user-not-in-group.exception';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private readonly userGroupService: UserGroupService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const requestBody = request.body;
    if (!requestBody) throw new GroupNotFoundException();
    const groupId = request.body.groupId;
    const userGroupCacheKey = generateUserGroupCache(user, groupId);
    const cachedUserGroup: UserGroup = await this.cacheManager.get(
      userGroupCacheKey,
    );
    if (cachedUserGroup) return cachedUserGroup.isAdmin;
    let userGroup;

    userGroup = await this.userGroupService.listOne({
      groupId,
      userId: user.id,
    });

    if (!userGroup) throw new UserNotInGroupException();
    await this.cacheManager.set(
      userGroupCacheKey,
      userGroup,
      +(process.env.GROUP_INVITATION_CACHE_DEFAULT || 10000),
    );
    return userGroup.isAdmin;
  }
}
