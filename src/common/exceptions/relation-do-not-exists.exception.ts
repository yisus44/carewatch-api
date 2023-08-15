import { BadRequestException } from '@nestjs/common';

export class RelationDoNotExistsException extends BadRequestException {
  constructor() {
    super('Relation do not exist');
  }
}
