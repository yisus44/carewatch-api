import { BadRequestException, Injectable } from '@nestjs/common';

import { CoreService } from '../core/core.service';
import { Group } from './entities/group.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { CreateGroupDto } from './dto/create-group.dto';
import { User } from '../users/entities/user.entity';
import { MailService } from '../mail/mail.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { FreePlanReachedException } from '../common/exceptions/free-plan-reached.exception';
import { GroupNotFoundException } from '../common/exceptions/group-not-found.exception';
import { UserGroupService } from '../user-groups/user-group.service';
import { InvitateUsersToGroup } from '../user-groups/dto/invitate-users-to-group.dto';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { UserGroup } from '../user-groups/entities/group-invitation.entity';
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

  async batchAdd(entities: Group[], user: User) {
    const promiseArr = [];
    for (const entity of entities) {
      delete entity.id;
      delete entity.createdAt;
      const canCreateMoreGroups = await this.canCreateMoreGroups(user);
      if (!canCreateMoreGroups) throw new FreePlanReachedException();
      promiseArr.push(this.create(entity));
    }
    await Promise.all(promiseArr);
  }
  async batchUpdate(entities: Partial<Group>[]) {
    const promiseArr = [];
    if (!entities) return;
    for (const entity of entities) {
      promiseArr.push(this.update(entity.id, entity));
    }
    await Promise.all(promiseArr);
  }
  async add(createGroupDto: CreateGroupDto, user: User) {
    const canCreateMoreGroups = await this.canCreateMoreGroups(user);
    if (!canCreateMoreGroups) throw new FreePlanReachedException();
    const group = await super.create(createGroupDto);
    await this.userGroupService.create({
      userId: user.id,
      groupId: group.id,
      isAdmin: true,
      isActive: true,
    });
    return group;
  }

  async getUserGroups(paginationDto: PaginationDto, user: User) {
    const { page, perPage } = paginationDto;
    const skippedItems = (page - 1) * perPage;
    const [data, totalCount] = await this.getQueryOfGroupsFromUser(user)
      .skip(skippedItems)
      .take(perPage)
      .getManyAndCount();
    return this.calculatePagination(data, totalCount, page, perPage);
  }

  getQueryOfGroupsFromUser(user: User) {
    return this.getQueryBuilder('groups')
      .leftJoinAndSelect('groups.userGroups', 'group_invitation') // Use alias 'group_invitation' for the join
      .where(
        `group_invitation.user_id = :userId and 
        (group_invitation.is_active = true or group_invitation.is_admin=true )
        and groups.deleted_at is null 
        `,
        { userId: user.id },
      );
  }

  async canCreateMoreGroups(user: User) {
    const usersGroup = await this.userGroupService.list({
      isAdmin: true,
      userId: user.id,
    });

    if (
      usersGroup.length > +process.env.FREE_PREMIUM_MAX_GROUPS &&
      !user.isPremium
    )
      return false;
    return true;
  }

  async inviteUsersToGroup(
    invitateUsersToGroup: InvitateUsersToGroup,
    user: User,
  ) {
    const carewatchInvitationsPromise: Promise<UserGroup | void>[] = [];
    const group = await this.findOneById(invitateUsersToGroup.groupId);
    if (!group) throw new GroupNotFoundException();

    for (const carewatchInvitation of invitateUsersToGroup.carewatchInvitation) {
      carewatchInvitationsPromise.push(
        this.userGroupService.create({
          groupId: invitateUsersToGroup.groupId,
          userId: carewatchInvitation.userId,
        }),
      );
    }

    for (const emailInvitation of invitateUsersToGroup.emailInvitation) {
      const userGroup = await this.userGroupService.create({
        groupId: invitateUsersToGroup.groupId,
        guestEmail: emailInvitation.email,
        guestName: emailInvitation.name,
      });

      carewatchInvitationsPromise.push(
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
      const userGroup = await this.userGroupService.create({
        groupId: invitateUsersToGroup.groupId,
        guestPhone: whatsappInvitation.phone.toString(),
        guestName: whatsappInvitation.name,
      });
      carewatchInvitationsPromise.push(
        this.whatsAppService.sendWhatsAppInvitation(
          whatsappInvitation.phone,
          whatsappInvitation.name,
          user,
          group.name,
          `${process.env.DOMAIN}/join/${userGroup.token}`,
        ),
      );
    }

    try {
      console.log(await Promise.all(carewatchInvitationsPromise));
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
