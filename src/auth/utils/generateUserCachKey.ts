import { User } from 'src/users/entities/user.entity';

export function generateUserCache(user: User) {
  return 'USER-ID' + user.id;
}
