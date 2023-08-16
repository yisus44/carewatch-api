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
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permission.decorator';
import { Permission } from '../enums/permission.enum';
import { RemindersService } from 'src/reminders/reminders.service';
import { MedicinesService } from 'src/medicines/medicines.service';
import { UserNotInGroupException } from 'src/common/exceptions/user-not-in-group.exception';
import { GroupNotFoundException } from 'src/common/exceptions/group-not-found.exception';
import { UserNotLoggedInException } from 'src/common/exceptions/user-not-logged-in.exception';
import { ResourceNotPartOfGroupException } from 'src/common/exceptions/resource-not-part-of-group.excepction';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly userGroupService: UserGroupService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private reflector: Reflector,
    private readonly reminderService: RemindersService,
    private readonly medicineService: MedicinesService,
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
    if (!groupId) throw new GroupNotFoundException();
    if (!user) throw new UserNotLoggedInException();
    const userGroup = await this.userGroupService.listOne({
      groupId,
      userId: user.id,
    });
    if (!userGroup) throw new UserNotInGroupException();
    const reminderId = requestBody.reminderId || requestQuery.reminderId;
    if (reminderId) {
      const match = await this.reminderService.listOne({ groupId });
      if (!match) throw new ResourceNotPartOfGroupException();
    }
    const medicineId = requestBody.medicineId || requestQuery.medicineId;
    if (medicineId) {
      const match = await this.medicineService.listOne({ groupId });
      if (!match) throw new ResourceNotPartOfGroupException();
    }
    for (const requiredPermission of requiredPermissions) {
      if (!userGroup.isAdmin && !userGroup[requiredPermission]) return false;
    }

    return true;
  }
}
