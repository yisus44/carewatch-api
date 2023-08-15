import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { GroupInvitationsService } from '../group-invitations.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { generateUserInvitationCache } from '../utils/generate-user-invitation-cache-key.util';
import { GroupInvitation } from '../entities/group-invitation.entity';
import { GroupNotFoundException } from 'src/common/exceptions/group-not-found.exception';
import { UserNotInGroupException } from 'src/common/exceptions/user-not-in-group.exception';

@Injectable()
export class MemberGuard implements CanActivate {
  constructor(
    private readonly groupInvitationService: GroupInvitationsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const requestBody = request.body;
    if (!requestBody) throw new GroupNotFoundException();
    const groupId = request.body.groupId;
    const groupInvitationcacheKey = generateUserInvitationCache(user, groupId);
    const cachedGroupInvitation: GroupInvitation = await this.cacheManager.get(
      groupInvitationcacheKey,
    );
    if (cachedGroupInvitation) return true;
    let groupInvitation;

    groupInvitation = await this.groupInvitationService.listOne({
      groupId,
      userId: user.id,
    });

    if (!groupInvitation) throw new UserNotInGroupException();
    await this.cacheManager.set(
      groupInvitationcacheKey,
      groupInvitation,
      +(process.env.GROUP_INVITATION_CACHE_DEFAULT || 10000),
    );
    return true;
  }
}
