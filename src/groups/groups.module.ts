import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { Group } from './entities/group.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserGroupModule } from 'src/user-groups/user-group.module';
import { AuthModule } from 'src/auth/auth.module';
import { MailModule } from 'src/mail/mail.module';

@Module({
  controllers: [GroupsController],
  providers: [GroupsService],
  imports: [
    TypeOrmModule.forFeature([Group]),
    UserGroupModule,
    AuthModule,
    MailModule,
  ],
})
export class GroupsModule {}
