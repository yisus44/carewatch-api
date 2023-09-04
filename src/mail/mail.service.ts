import { Injectable } from '@nestjs/common';
import { AwsService } from '../aws/aws.service';
import { EmailTemplates } from '../aws/enums/email-templates.enum';
import { User } from '../users/entities/user.entity';

@Injectable()
export class MailService {
  constructor(private readonly awsService: AwsService) {}

  async sendEmailInvitation(
    email: string,
    invitatedUser: string,
    adminUser: User,
    groupName: string,
    link: string,
  ) {
    await this.awsService.generateInvitationTemplate();
    this.awsService.sendEmail(
      [email],
      'jesusadrian1953.1@gmail.com',
      EmailTemplates.userGroupInvitation,
      JSON.stringify({
        group: groupName,
        link,
        invitatedUser,
        adminUser: `${adminUser.name} ${adminUser.lastName}`,
      }),
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
