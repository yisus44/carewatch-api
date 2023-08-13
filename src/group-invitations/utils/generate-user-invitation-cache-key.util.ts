import { User } from 'src/users/entities/user.entity';

export function generateUserInvitationCache(user: User, groupId: number) {
  return 'USER-ID' + user.id + 'GROUP-ID' + groupId;
}
