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
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permission.decorator';
import { Permission } from '../enums/permission.enum';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly groupInvitationService: GroupInvitationsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<Permission[]>(
      PERMISSIONS_KEY,
      context.getHandler(),
    );
    if (!requiredPermissions) return true;
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const requestBody = request.body;
    const requestQuery = request.query;
    const groupId = requestBody.groupId || requestQuery.groupId;
    if (!groupId) throw new NotFoundException('Group not found');
    const groupInvitation = await this.groupInvitationService.listOne({
      groupId,
      userId: user.id,
    });
    for (const requiredPermission of requiredPermissions) {
      if (!groupInvitation.isAdmin && !groupInvitation[requiredPermission])
        return false;
    }

    return true;
  }
}
