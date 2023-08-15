import { BadRequestException } from '@nestjs/common';

export class FreePlanReachedException extends BadRequestException {
  constructor() {
    super('Free plan reached');
  }
}
