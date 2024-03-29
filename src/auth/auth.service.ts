import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { UsersService } from '../users/users.service';
import { SignInDto } from './dto/signin.dto';

import { PostgresErrorCode } from '../database/postgresErrorCodes.enum';
import { sign } from 'jsonwebtoken';
import { User } from '../users/entities/user.entity';
import { CommonService } from '../common/common.service';
import { MailService } from '../mail/mail.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { UserNotFoundException } from '../common/exceptions/user-not-found.excepction';
import { InvalidCredentialsException } from '../common/exceptions/invalid-credentails.exception';
import { EmailInUseException } from '../common/exceptions/email-in-use.exception';
import { BcryptType } from './types/bcrypt.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly commonService: CommonService,
    private readonly mailService: MailService,
    private readonly subscriptionsService: SubscriptionsService,
    @Inject('BcryptType') private readonly bcrypt: BcryptType,
  ) {}
  async signUp(registerDto: SignUpDto) {
    const hashedPassword = await this.bcrypt.hash(registerDto.password, 10);
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
    const expirationTime = process.env.JWT_EXPIRATION_TIME || '48h'; // Example:
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

    return sign(payload, process.env.JWT_SECRET || 'developmentesecret<', {
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
    return await this.bcrypt.compare(plainTextPassword, hashedPassword);
  }

  public getCookieForLogOut() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }

  public demoEmail() {
    this.mailService.demoEmail();
    return;
  }
}
