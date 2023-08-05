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
import { GroupInvitationsService } from 'src/group-invitations/group-invitations.service';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class GroupsService extends CoreService<Group> {
  constructor(
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
    private readonly groupInvitationService: GroupInvitationsService,
    private readonly mailService: MailService,
  ) {
    super(groupRepository);
  }

  async add(createGroupDto: CreateGroupDto, user: User) {
    const canCreateMoreGroups = await this.canCreateMoreGroups(user);
    if (!canCreateMoreGroups)
      throw new BadRequestException('Free plan reached');
    const group = await super.create(createGroupDto);
    await this.groupInvitationService.create({
      userId: user.id,
      groupId: group.id,
      isAdmin: true,
    });
    return group;
  }

  async inviteByMail(guestEmail: string, groupId: number) {
    const group = await this.findOneById(groupId);
    if (!group) throw new NotFoundException();
    const match = await this.groupInvitationService.listOne({
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
    const invitation = await this.groupInvitationService.create({
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
    const usersGroup = await this.groupInvitationService.list({
      isAdmin: true,
      userId: user.id,
    });

    if (usersGroup.length > 2 && !user.isPremium) return false;
    return true;
  }
}
