import { User } from '../../users/entities/user.entity';

export function generateUserCacheIsPremium(user: User) {
  return 'USER-ID-PREMIUM' + user.id;
}
export function generateUserCacheHasPaymentMethod(user: User) {
  return 'USER-ID-PAYMENT-METHOD' + user.id;
}
