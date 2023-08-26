import { Module } from '@nestjs/common';
import { AwsSesService } from './aws-ses.service';
import { AwsSesController } from './aws-ses.controller';
import { AssetsModule } from '../assets/assets.module';
import { SES } from 'aws-sdk';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [AwsSesController],
  imports: [AssetsModule],
  providers: [
    AwsSesService,
    {
      provide: SES,
      useFactory: async () =>
        new SES({
          apiVersion: '2010-12-01',
          region: process.env.AWS_REGION,
        }),
    },
  ],
})
export class AwsSesModule {}
