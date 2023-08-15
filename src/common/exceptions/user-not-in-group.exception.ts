import { ForbiddenException } from '@nestjs/common';

export class UserNotInGroupException extends ForbiddenException {
  constructor() {
    super('User not part of this group');
  }
}
