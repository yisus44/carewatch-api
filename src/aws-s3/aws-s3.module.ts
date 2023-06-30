import { Module } from '@nestjs/common';
import { AwsS3Service } from './aws-s3.service';
import { AwsS3Controller } from './aws-s3.controller';
import { S3 } from 'aws-sdk';

@Module({
  controllers: [AwsS3Controller],
  providers: [
    AwsS3Service,
    {
      provide: S3,
      useFactory: async () =>
        new S3({
          apiVersion: '2010-12-01',
          region: process.env.AWS_REGION,
        }),
    },
  ],
})
export class AwsS3Module {}
