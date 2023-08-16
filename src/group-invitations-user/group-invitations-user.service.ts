import { Injectable } from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { UserGroupService } from 'src/user-groups/user-group.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class GroupInvitationsUserService {
  constructor(
    private readonly userGroupService: UserGroupService,
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
      .leftJoinAndSelect('users.userGroup', 'user_group') // Use alias 'user_group' for the join
      .where(
        `(LOWER(users.name) like LOWER(:term) OR LOWER(users.last_name) like LOWER(:term)) 
      AND (user_group.group_id <> :groupId OR user_group.group_id IS NULL)`,
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
