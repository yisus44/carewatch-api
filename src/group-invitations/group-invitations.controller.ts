import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AdminGuard } from './guards/admin.guard';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('group-invitations')
export class GroupInvitationsController {
  @UseGuards(AuthGuard, AdminGuard)
  @Post()
  inviteUsers() {
    console.log();
  }
}
