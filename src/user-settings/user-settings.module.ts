import { Module } from '@nestjs/common';
import { UserSettingsService } from './user-settings.service';
import { UserSettingsController } from './user-settings.controller';
import { UserSetting } from './entities/user-setting.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [UserSettingsController],
  providers: [UserSettingsService, JwtService],
  imports: [TypeOrmModule.forFeature([UserSetting])],
  exports: [TypeOrmModule, UserSettingsService],
})
export class UserSettingsModule {}
