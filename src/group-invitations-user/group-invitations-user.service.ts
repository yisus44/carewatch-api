import { Injectable } from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { GroupInvitationsService } from 'src/group-invitations/group-invitations.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class GroupInvitationsUserService {
  constructor(
    private readonly groupInvitationService: GroupInvitationsService,
    private readonly userService: UsersService,
  ) {}
  async searchUsers(
    paginationDto: PaginationDto,
    term: string,
    groupId: number,
  ) {
    const { page, perPage } = paginationDto;
    const skippedItems = (page - 1) * perPage;
    const [data, totalCount] = await this.userService
      .getQueryBuilder('users')
      .leftJoinAndSelect('users.groupInvitation', 'group_invitation') // Use alias 'group_invitation' for the join
      .where(
        `(LOWER(users.name) like LOWER(:term) OR LOWER(users.last_name) like LOWER(:term)) 
      AND (group_invitation.group_id <> :groupId OR group_invitation.group_id IS NULL)`,
        { term: `%${term}%`, groupId: +groupId },
      )
      .skip(skippedItems)
      .take(perPage)
      .getManyAndCount();
    return this.userService.calculatePagination(
      data,
      totalCount,
      page,
      perPage,
    );
  }
}
