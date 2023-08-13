import { Module } from '@nestjs/common';
import { GroupInvitationsService } from './group-invitations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupInvitation } from './entities/group-invitation.entity';
import { GroupInvitationsController } from './group-invitations.controller';
import { AuthModule } from 'src/auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  providers: [GroupInvitationsService],
  exports: [GroupInvitationsService],
  imports: [
    TypeOrmModule.forFeature([GroupInvitation]),
    CacheModule.register(),
    AuthModule,
  ],
  controllers: [GroupInvitationsController],
})
export class GroupInvitationsModule {}
