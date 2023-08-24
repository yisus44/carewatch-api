import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserGroupDto } from './dto/create-group-invitation.dto';
import { UpdateUserGroupDto } from './dto/update-group-invitation.dto';
import { CoreService } from 'src/core/core.service';
import { UserGroup } from './entities/group-invitation.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';

@Injectable()
export class UserGroupService extends CoreService<UserGroup> {
  constructor(
    @InjectRepository(UserGroup)
    private readonly userGroupRepository: Repository<UserGroup>,
  ) {
    super(userGroupRepository);
  }

  generateTokenInvitation() {
    return crypto.randomBytes(10).toString('hex');
  }

  async create(createUserGroupDto: CreateUserGroupDto) {
    const token = this.generateTokenInvitation();
    let match;
    if (createUserGroupDto.userId) {
      match = await this.listOne({
        userId: createUserGroupDto.userId,
        groupId: createUserGroupDto.groupId,
      });
    }

    if (createUserGroupDto.guestPhone) {
      match = await this.listOne({
        guestPhone: createUserGroupDto.guestPhone,
        groupId: createUserGroupDto.groupId,
      });
    }

    if (createUserGroupDto.guestEmail) {
      match = await this.listOne({
        guestEmail: createUserGroupDto.guestEmail,
        groupId: createUserGroupDto.groupId,
      });
    }

    if (match) return match;
    return await super.create({ ...createUserGroupDto, token });
  }
}
