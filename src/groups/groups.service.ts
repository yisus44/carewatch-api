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
import { InvitateUsersToGroup } from 'src/user-groups/dto/invitate-users-to-group.dto';
import { WhatsappService } from 'src/whatsapp/whatsapp.service';
import { UserGroup } from 'src/user-groups/entities/group-invitation.entity';

@Injectable()
export class GroupsService extends CoreService<Group> {
  constructor(
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
    private readonly userGroupService: UserGroupService,
    private readonly mailService: MailService,
    private readonly whatsAppService: WhatsappService,
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

  async canCreateMoreGroups(user: User) {
    const usersGroup = await this.userGroupService.list({
      isAdmin: true,
      userId: user.id,
    });

    if (usersGroup.length > +process.env.FREE_PREMIUM_MAX_GROUPS && !user.isPremium) return false;
    return true;
  }

  async inviteUsersToGroup(
    invitateUsersToGroup: InvitateUsersToGroup,
    user: User,
  ) {
    const careWatchInvitationsPromise: Promise<UserGroup | void>[] = [];
    const group = await this.findOneById(invitateUsersToGroup.groupId);
    if (!group) throw new GroupNotFoundException();

    for (const careWatchInvitation of invitateUsersToGroup.careWatchInvitation) {
      careWatchInvitationsPromise.push(
        this.userGroupService.create({
          groupId: invitateUsersToGroup.groupId,
          userId: careWatchInvitation.userId,
        }),
      );
    }

    for (const emailInvitation of invitateUsersToGroup.emailInvitation) {
      const userGroup = await this.userGroupService.create({
        groupId: invitateUsersToGroup.groupId,
        guestEmail: emailInvitation.email,
        guestName: emailInvitation.name,
      });

      careWatchInvitationsPromise.push(
        this.mailService.sendEmailInvitation(
          emailInvitation.email,
          emailInvitation.name,
          user,
          group.name,
          `${process.env.DOMAIN}/join/${userGroup.token}`,
        ),
      );
    }

    for (const whatsappInvitation of invitateUsersToGroup.whatsappInvitation) {
      careWatchInvitationsPromise.push(
        this.userGroupService.create({
          groupId: invitateUsersToGroup.groupId,
          guestPhone: whatsappInvitation.phone.toString(),
          guestName: whatsappInvitation.name,
        }),
      );
    }

    try {
      console.log(await Promise.all(careWatchInvitationsPromise));
    } catch (ex) {
      console.log(ex);
      const modifiedError = new BadRequestException(
        'Not all invitation could be sent correctly. Make sure you specified valid id',
      );
      modifiedError.stack = modifiedError.stack;
      throw modifiedError;
    }
  }
}
