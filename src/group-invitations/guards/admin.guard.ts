import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { GroupInvitationsService } from '../group-invitations.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private readonly groupInvitationService: GroupInvitationsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const requestBody = request.body;
    if (!requestBody) throw new NotFoundException('Group not found');
    const groupId = request.body.groupId;
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

    return groupInvitation.isAdmin;
  }
}
