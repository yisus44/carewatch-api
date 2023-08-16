import { User } from 'src/users/entities/user.entity';

export function generateUserGroupCache(user: User, groupId: number) {
  return 'USER-ID' + user.id + 'GROUP-ID' + groupId;
}
