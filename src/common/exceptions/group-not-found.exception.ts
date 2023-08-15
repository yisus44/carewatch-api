import { NotFoundException } from '@nestjs/common';

export class GroupNotFoundException extends NotFoundException {
  constructor() {
    super('Group not found');
  }
}
