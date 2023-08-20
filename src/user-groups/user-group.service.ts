import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserGroupDto } from './dto/create-group-invitation.dto';
import { UpdateUserGroupDto } from './dto/update-group-invitation.dto';
import { CoreService } from 'src/core/core.service';
import { UserGroup } from './entities/group-invitation.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import { InvitateUsersToGroup } from './dto/invitate-users-to-group.dto';
import { WhatsappService } from 'src/whatsapp/whatsapp.service';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UserGroupService extends CoreService<UserGroup> {
  constructor(
    @InjectRepository(UserGroup)
    private readonly fileRepository: Repository<UserGroup>,
    private readonly whatsAppService: WhatsappService,
    private readonly mailService: MailService,
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

    if (createUserGroupDto.guestPhone) {
      const match = await this.listOne({
        guestPhone: createUserGroupDto.guestPhone,
        groupId: createUserGroupDto.groupId,
      });
      if (match) return match;
      await this.whatsAppService.sendWhatsAppInvitation(
        token,
        +createUserGroupDto.guestPhone,
      );
    }

    if (createUserGroupDto.guestEmail) {
      const match = await this.listOne({
        guestEmail: createUserGroupDto.guestEmail,
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

    for (const emailInvitation of invitateUsersToGroup.emailInvitation) {
      careWatchInvitationsPromise.push(
        this.create({
          groupId: invitateUsersToGroup.groupId,
          guestEmail: emailInvitation.email,
          guestName: emailInvitation.name,
        }),
      );
    }

    for (const whatsappInvitation of invitateUsersToGroup.whatsappInvitation) {
      careWatchInvitationsPromise.push(
        this.create({
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
