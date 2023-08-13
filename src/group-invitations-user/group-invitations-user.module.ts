import { Module } from '@nestjs/common';
import { GroupInvitationsUserService } from './group-invitations-user.service';
import { GroupInvitationsUserController } from './group-invitations-user.controller';
import { GroupsModule } from 'src/groups/groups.module';
import { UsersModule } from 'src/users/users.module';
import { GroupInvitationsModule } from 'src/group-invitations/group-invitations.module';

@Module({
  controllers: [GroupInvitationsUserController],
  providers: [GroupInvitationsUserService],
  imports: [GroupInvitationsModule, UsersModule],
})
export class GroupInvitationsUserModule {}
