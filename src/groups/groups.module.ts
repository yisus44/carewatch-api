import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { Group } from './entities/group.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupInvitationsModule } from 'src/group-invitations/group-invitations.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [GroupsController],
  providers: [GroupsService],
  imports: [
    TypeOrmModule.forFeature([Group]),
    GroupInvitationsModule,
    AuthModule,
  ],
})
export class GroupsModule {}
