import { BadRequestException } from '@nestjs/common';

export class ResourceAlreadyExist extends BadRequestException {
  constructor() {
    super('Resource already exists');
  }
}
