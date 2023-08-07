import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

import { LoginDto } from './dto/login.dto';
import { GetCurrentUser } from './decorators/current-user';
import { User } from 'src/users/entities/user.entity';
import { AuthGuard } from './guards/auth.guard';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  signup(@Body() registerDto: RegisterDto) {
    return this.authService.signUp(registerDto);
  }

  @Post('/signin')
  signIn(@Body() loginDto: LoginDto) {
    return this.authService.signIn(loginDto);
  }

  @UseGuards(AuthGuard)
  @Post('test')
  async test(@GetCurrentUser() currentUser: User) {
    console.log({ currentUser });
    this.authService.demoEmail();
    return;
  }
}
