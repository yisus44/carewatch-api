import { Module } from '@nestjs/common';
import { UserGroupService } from './user-group.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserGroup } from './entities/group-invitation.entity';
import { UserGroupsController } from './user-group.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_GUARD } from '@nestjs/core';
import { PermissionGuard } from './guards/permission.guard';
import { RemindersModule } from '../reminders/reminders.module';
import { MedicinesModule } from '../medicines/medicines.module';
import { WhatsappModule } from '../whatsapp/whatsapp.module';
import { MailModule } from '../mail/mail.module';

@Module({
  providers: [
    UserGroupService,
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
  exports: [UserGroupService],
  imports: [
    TypeOrmModule.forFeature([UserGroup]),
    CacheModule.register(),
    RemindersModule,
    MedicinesModule,
  ],
  controllers: [UserGroupsController],
})
export class UserGroupModule {}
