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
import { SignUpDto } from './dto/signup.dto';

import { SignInDto } from './dto/signin.dto';
import { GetCurrentUser } from './decorators/current-user';
import { User } from '../users/entities/user.entity';
import { AuthGuard } from './guards/auth.guard';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  signup(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('/signin')
  signIn(@Body() signInDto: SignInDto) {
    // return this.authService.signIn(signInDto);
  }

  @Post('/verify')
  verify(@Body() signInDto: SignInDto) {
    return this.authService.verify(signInDto);
  }

  @UseGuards(AuthGuard)
  @Post('test')
  async test(@GetCurrentUser() currentUser: User) {
    console.log({ currentUser });
    this.authService.demoEmail();
    return;
  }
}
