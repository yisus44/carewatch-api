import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { AwsModule } from '../aws/aws.module';

@Module({
  providers: [MailService],
  exports: [MailService],
  imports: [AwsModule],
})
export class MailModule {}
