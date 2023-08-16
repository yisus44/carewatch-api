import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CoreService } from 'src/core/core.service';
import { Group } from './entities/group.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGroupDto } from './dto/create-group.dto';
import { User } from 'src/users/entities/user.entity';
import { MailService } from 'src/mail/mail.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { FreePlanReachedException } from 'src/common/exceptions/free-plan-reached.exception';
import { GroupNotFoundException } from 'src/common/exceptions/group-not-found.exception';
import { UserGroupService } from 'src/user-groups/user-group.service';

@Injectable()
export class GroupsService extends CoreService<Group> {
  constructor(
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
    private readonly userGroupService: UserGroupService,
    private readonly mailService: MailService,
  ) {
    super(groupRepository);
  }

  async add(createGroupDto: CreateGroupDto, user: User) {
    const canCreateMoreGroups = await this.canCreateMoreGroups(user);
    if (!canCreateMoreGroups) throw new FreePlanReachedException();
    const group = await super.create(createGroupDto);
    await this.userGroupService.create({
      userId: user.id,
      groupId: group.id,
      isAdmin: true,
    });
    return group;
  }

  async getUserGroups(paginationDto: PaginationDto, user: User) {
    const { page, perPage } = paginationDto;
    const skippedItems = (page - 1) * perPage;
    const [data, totalCount] = await this.getQueryBuilder('groups')
      .leftJoinAndSelect('groups.userGroups', 'group_invitation') // Use alias 'group_invitation' for the join
      .where(`group_invitation.user_id = :userId `, { userId: user.id })
      .skip(skippedItems)
      .take(perPage)
      .getManyAndCount();
    return this.calculatePagination(data, totalCount, page, perPage);
  }

  async inviteByMail(guestEmail: string, groupId: number) {
    const group = await this.findOneById(groupId);
    if (!group) throw new GroupNotFoundException();
    const match = await this.userGroupService.listOne({
      groupId,
      guestEmail,
    });
    let link;
    if (match) {
      link = `${process.env.DOMAIN}/invitation/${match.token}`;
      return await this.mailService.sendEmailInvitation(
        guestEmail,
        group.name,
        link,
      );
    }
    const invitation = await this.userGroupService.create({
      groupId,
      guestEmail,
    });
    link = `${process.env.DOMAIN}/invitation/${invitation.token}`;
    return await this.mailService.sendEmailInvitation(
      guestEmail,
      group.name,
      link,
    );
  }

  async canCreateMoreGroups(user: User) {
    const usersGroup = await this.userGroupService.list({
      isAdmin: true,
      userId: user.id,
    });

    if (usersGroup.length > 2 && !user.isPremium) return false;
    return true;
  }
}
