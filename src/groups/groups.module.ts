import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { Group } from './entities/group.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserGroupModule } from '../user-groups/user-group.module';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../mail/mail.module';
import { WhatsappModule } from '../whatsapp/whatsapp.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  controllers: [GroupsController],
  providers: [GroupsService],
  imports: [
    TypeOrmModule.forFeature([Group]),
    UserGroupModule,
    AuthModule,
    MailModule,
    WhatsappModule,
    MailModule,
    CacheModule.register(),
  ],
})
export class GroupsModule {}
