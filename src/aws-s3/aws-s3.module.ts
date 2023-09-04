import { Module } from '@nestjs/common';
import { AwsS3Service } from './aws-s3.service';
import { AwsS3Controller } from './aws-s3.controller';
import { S3Client } from '@aws-sdk/client-s3';

@Module({
  controllers: [AwsS3Controller],
  providers: [
    AwsS3Service,
    {
      provide: S3Client,
      useFactory: async () =>
        new S3Client({
          apiVersion: '2010-12-01',
          region: process.env.AWS_REGION,
        }),
    },
  ],
})
export class AwsS3Module {}
