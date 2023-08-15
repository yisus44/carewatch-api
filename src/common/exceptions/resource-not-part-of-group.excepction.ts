import { ForbiddenException } from '@nestjs/common';

export class ResourceNotPartOfGroupException extends ForbiddenException {
  constructor() {
    super('Resource is not part of the group');
  }
}
