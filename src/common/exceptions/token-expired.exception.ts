import { UnauthorizedException } from '@nestjs/common';

export class JwtTokenExpired extends UnauthorizedException {
  constructor() {
    super('Token expired');
  }
}
