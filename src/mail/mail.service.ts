import { Injectable } from '@nestjs/common';
import { AwsService } from '../aws/aws.service';
import { EmailTemplates } from '../aws/enums/email-templates.enum';
import { User } from '../users/entities/user.entity';
import { Reminder } from 'src/reminders/entities/reminder.entity';
import { Medicine } from 'src/medicines/entities/medicine.entity';
import { Group } from 'src/groups/entities/group.entity';
import { ReminderActivationTime } from 'src/reminder-activation-time/entities/reminder-activation-time.entity';
import { FrequencyType } from 'src/frequency-types/entities/frequency-type.entity';

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

  async sendMailReminder(
    userName: string,
    email: string,
    reminder: Reminder,
    medicine: Medicine,
    group: Group,
    reminderActivationTime: ReminderActivationTime,
    frequencyType: FrequencyType,
    token: string,
  ) {
    await this.awsService.generateReminderTemplate();
    this.awsService.sendEmail(
      [email],
      'jesusadrian1953.1@gmail.com',
      EmailTemplates.reminder,
      JSON.stringify({
        userName,
        medicineName: medicine.name,
        groupName: group.name,
        dosis: reminder.dosis,
        aditionalDetails: reminder.additionalDetails,
        time:
          reminderActivationTime.time ??
          `Cada ${reminderActivationTime.times} ${frequencyType.name}`,
        domain: ` ${process.env.DOMAIN}/delete/${token}`,
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
