import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { UsersService } from '../users/users.service';
import { SignInDto } from './dto/signin.dto';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PostgresErrorCode } from 'src/database/postgresErrorCodes.enum';
import { sign } from 'jsonwebtoken';
import { User } from 'src/users/entities/user.entity';
import { CommonService } from 'src/common/common.service';
import { MailService } from 'src/mail/mail.service';
import { SubscriptionsService } from 'src/subscriptions/subscriptions.service';
import { UserNotFoundException } from 'src/common/exceptions/user-not-found.excepction';
import { InvalidCredentialsException } from 'src/common/exceptions/invalid-credentails.exception';
import { EmailInUseException } from 'src/common/exceptions/email-in-use.exception';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly commonService: CommonService,
    private readonly mailService: MailService,
    private readonly subscriptionsService: SubscriptionsService,
  ) {}
  async signUp(registerDto: SignUpDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    try {
      const createdUser = await this.usersService.create({
        ...registerDto,
        password: hashedPassword,
      });
      delete createdUser.password;
      await this.subscriptionsService.create(createdUser);
      return await this.getAuthInfo(createdUser);
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new EmailInUseException();
      }
      throw error;
    }
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.usersService.findByEmail(signInDto.email);
    if (!user) throw new UserNotFoundException();
    const match = await this.verifyPassword(signInDto.password, user.password);
    if (!match) throw new InvalidCredentialsException();
    return await this.getAuthInfo(user);
  }
  async verify(signInDto: SignInDto) {
    try {
      await this.signIn(signInDto);
      return { result: true };
    } catch (error) {
      return { result: false };
    }
  }
  async getAuthInfo(user: User) {
    const expirationTime = process.env.JWT_EXPIRATION_TIME; // Example: "48h"
    const token = await this.signPayload(user, expirationTime);
    const expiresInMilliseconds =
      this.commonService.parseDurationToMilliseconds(expirationTime);
    const expirationTimestamp = Date.now() + expiresInMilliseconds;
    delete user.password;
    return { token, user, expirationTimestamp };
  }

  async signPayload(user: User, expirationTime: string) {
    const payload = {
      id: user.id,
      isActive: user.isActive,
    };

    return sign(payload, process.env.JWT_SECRET, {
      expiresIn: expirationTime,
    });
  }

  async getAuthenticatedUser(signInDto: SignInDto) {
    try {
      const user = await this.usersService.findByEmail(signInDto.email);
      await this.verifyPassword(signInDto.password, user.password);
      delete user.password;
      return user;
    } catch (error) {
      throw new InvalidCredentialsException();
    }
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
  }

  public getCookieForLogOut() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }

  public demoEmail() {
    this.mailService.demoEmail();
    return;
  }
}
