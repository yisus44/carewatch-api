import { Module } from '@nestjs/common';
import { GroupInvitationsService } from './group-invitations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupInvitation } from './entities/group-invitation.entity';

@Module({
  providers: [GroupInvitationsService],
  exports: [GroupInvitationsService],
  imports: [TypeOrmModule.forFeature([GroupInvitation])],
})
export class GroupInvitationsModule {}
