import { MiddlewareConsumer, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import * as Joi from '@hapi/joi';
import { CommonModule } from './common/common.module';
import { FilesModule } from './files/files.module';
import { FileTypeModule } from './file-type/file-type.module';
import { SeedModule } from './seed/seed.module';
import { JwtMiddleware } from './auth/middleware/jwt.middleware';
import { UserSettingsModule } from './user-settings/user-settings.module';
import { MailModule } from './mail/mail.module';
import { AwsModule } from './aws/aws.module';
import { AssetsService } from './assets/assets.service';
import { AssetsModule } from './assets/assets.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './.env.copy',
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DATABASE: Joi.string().required(),
        PORT: Joi.number(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    CommonModule,
    FileTypeModule,
    FilesModule,
    SeedModule,
    UserSettingsModule,
    MailModule,
    AwsModule,
    AssetsModule,
    CacheModule.register(),
  ],
  controllers: [AppController],
  providers: [AppService, AssetsService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('*');
  }
}
