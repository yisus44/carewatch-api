import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PostgresErrorCode } from 'src/database/postgresErrorCodes.enum';
import { sign } from 'jsonwebtoken';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async signUp(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    try {
      const createdUser = await this.usersService.create({
        ...registerDto,
        password: hashedPassword,
      });
      delete createdUser.password;
      return createdUser;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new BadRequestException('Email already on use');
      }
      throw error;
    }
  }

  async signIn(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) throw new BadRequestException('User not found');
    const match = this.verifyPassword(loginDto.password, user.password);
    if (!match) throw new BadRequestException('Invalid credentials');
    const token = await this.signPayload(user);
    return { token, user };
  }

  async signPayload(user: User) {
    const payload = {
      id: user.id,
      isActive: user.isActive,
    };
    return sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION_TIME,
    });
  }

  async getAuthenticatedUser(loginDto: LoginDto) {
    try {
      const user = await this.usersService.findByEmail(loginDto.email);
      await this.verifyPassword(loginDto.password, user.password);
      delete user.password;
      return user;
    } catch (error) {
      throw new BadRequestException('Invalid credentials');
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
}
