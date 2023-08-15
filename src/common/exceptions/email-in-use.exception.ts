import { BadRequestException } from '@nestjs/common';

export class EmailInUseException extends BadRequestException {
  constructor() {
    super('Email already on use');
  }
}
