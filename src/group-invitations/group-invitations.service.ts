import { Injectable } from '@nestjs/common';
import { CreateGroupInvitationDto } from './dto/create-group-invitation.dto';
import { UpdateGroupInvitationDto } from './dto/update-group-invitation.dto';
import { CoreService } from 'src/core/core.service';
import { GroupInvitation } from './entities/group-invitation.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';

@Injectable()
export class GroupInvitationsService extends CoreService<GroupInvitation> {
  constructor(
    @InjectRepository(GroupInvitation)
    private readonly fileRepository: Repository<GroupInvitation>,
  ) {
    super(fileRepository);
  }

  generateTokenInvitation() {
    return crypto.randomBytes(10).toString('hex');
  }

  async create(createGroupInvitationDto: CreateGroupInvitationDto) {
    const token = this.generateTokenInvitation();
    return await super.create({ ...createGroupInvitationDto, token });
  }
}
