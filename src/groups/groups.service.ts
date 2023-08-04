import { BadRequestException, Injectable } from '@nestjs/common';

import { CoreService } from 'src/core/core.service';
import { Group } from './entities/group.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGroupDto } from './dto/create-group.dto';
import { User } from 'src/users/entities/user.entity';
import { GroupInvitationsService } from 'src/group-invitations/group-invitations.service';

@Injectable()
export class GroupsService extends CoreService<Group> {
  constructor(
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
    private readonly groupInvitationService: GroupInvitationsService,
  ) {
    super(groupRepository);
  }

  async add(createGroupDto: CreateGroupDto, user: User) {
    const usersGroup = await this.groupInvitationService.list({
      isAdmin: true,
      userId: user.id,
    });

    if (usersGroup.length > 2 && !user.isPremium)
      throw new BadRequestException('Group limit plan reached');
    const group = await super.create(createGroupDto);
    await this.groupInvitationService.create({
      userId: user.id,
      groupId: group.id,
      isAdmin: true,
    });
    return group;
  }

  async canCreateMoreGroups(user: User) {
    return true;
  }
}
