import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserGroupDto } from './dto/create-group-invitation.dto';
import { UpdateUserGroupDto } from './dto/update-group-invitation.dto';
import { CoreService } from 'src/core/core.service';
import { UserGroup } from './entities/group-invitation.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import { InvitateUsersToGroup } from './dto/invitate-users-to-group.dto';

@Injectable()
export class UserGroupService extends CoreService<UserGroup> {
  constructor(
    @InjectRepository(UserGroup)
    private readonly fileRepository: Repository<UserGroup>,
  ) {
    super(fileRepository);
  }

  generateTokenInvitation() {
    return crypto.randomBytes(10).toString('hex');
  }

  async create(createUserGroupDto: CreateUserGroupDto) {
    const token = this.generateTokenInvitation();
    if (createUserGroupDto.userId) {
      const match = await this.listOne({
        userId: createUserGroupDto.userId,
        groupId: createUserGroupDto.groupId,
      });
      if (match) return match;
    }
    return await super.create({ ...createUserGroupDto, token });
  }

  async inviteUsersToGroup(invitateUsersToGroup: InvitateUsersToGroup) {
    const careWatchInvitationsPromise = [];
    for (const careWatchInvitation of invitateUsersToGroup.careWatchInvitation) {
      careWatchInvitationsPromise.push(
        this.create({
          groupId: invitateUsersToGroup.groupId,
          userId: careWatchInvitation.userId,
        }),
      );
    }

    try {
      console.log(await Promise.all(careWatchInvitationsPromise));
    } catch (ex) {
      const modifiedError = new BadRequestException(
        'Not all invitation could be sent correctly. Make sure you specified valid id',
      );
      modifiedError.stack = modifiedError.stack;
      throw modifiedError;
    }
  }
}
