import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { AwsService } from 'src/aws/aws.service';
import { EmailTemplates } from 'src/aws/enums/email-templates.enum';

@Injectable()
export class MailService {
  constructor(private readonly awsService: AwsService) {}

  async sendEmailInvitation(email: string, groupName: string, link: string) {
    await this.awsService.generateAuthTemplate();
    this.awsService.sendEmail(
      ['jesusadrian1953.1@gmail.com'],
      'jesusadrian1953.1@gmail.com',
      EmailTemplates.userGroupInvitation,
      JSON.stringify({ group: groupName, link }),
    );
  }

  async demoEmail() {
    this.awsService.generateAuthTemplate();
    this.awsService.sendEmail(
      ['jesusadrian1953.1@gmail.com'],
      'jesusadrian1953.1@gmail.com',
      EmailTemplates.confirmAccount,
      JSON.stringify({ name: 'peso pluma' }),
    );
  }
}
