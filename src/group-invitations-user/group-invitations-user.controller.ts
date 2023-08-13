import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { GroupInvitationsUserService } from './group-invitations-user.service';
import { SearchGroupInvitationDto } from './dto/search-group-invitation.dto';

@Controller('group-invitations-user')
export class GroupInvitationsUserController {
  constructor(
    private readonly groupInvitationsUserService: GroupInvitationsUserService,
  ) {}

  @Get()
  search(@Query() searchGroupInvitation: SearchGroupInvitationDto) {
    return this.groupInvitationsUserService.searchUsers(
      searchGroupInvitation.term,
      searchGroupInvitation.groupId,
    );
  }
}
