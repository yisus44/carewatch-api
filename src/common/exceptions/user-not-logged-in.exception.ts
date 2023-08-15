import { ForbiddenException } from '@nestjs/common';

export class UserNotLoggedInException extends ForbiddenException {
  constructor() {
    super('User not logged in');
  }
}
