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

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private readonly groupInvitationService: GroupInvitationsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const requestBody = request.body;
    if (!requestBody) throw new NotFoundException('Group not found');
    const groupId = request.body.groupId;
    const groupInvitationcacheKey = generateUserInvitationCache(user, groupId);
    const cachedGroupInvitation: GroupInvitation = await this.cacheManager.get(
      groupInvitationcacheKey,
    );
    if (cachedGroupInvitation) return cachedGroupInvitation.isAdmin;
    let groupInvitation;
    try {
      groupInvitation = await this.groupInvitationService.listOne({
        groupId,
        userId: user.id,
      });
    } catch (ex) {
      throw new ForbiddenException();
    }

    if (!groupInvitation) throw new ForbiddenException();
    await this.cacheManager.set(
      groupInvitationcacheKey,
      groupInvitation,
      +(process.env.GROUP_INVITATION_CACHE_DEFAULT || 10000),
    );
    return groupInvitation.isAdmin;
  }
}
