import { Module } from '@nestjs/common';
import { UserSettingsService } from './user-settings.service';
import { UserSettingsController } from './user-settings.controller';
import { UserSetting } from './entities/user-setting.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [UserSettingsController],
  providers: [UserSettingsService, JwtService],
  imports: [TypeOrmModule.forFeature([UserSetting]), AuthModule],
  exports: [TypeOrmModule, UserSettingsService],
})
export class UserSettingsModule {}
