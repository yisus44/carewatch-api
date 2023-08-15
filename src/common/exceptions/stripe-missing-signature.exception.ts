import { BadRequestException } from '@nestjs/common';

export class StripeMissingSignatureException extends BadRequestException {
  constructor() {
    super('Missing stripe-signature header');
  }
}
