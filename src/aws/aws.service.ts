import { Injectable } from '@nestjs/common';
import {
  SESClient,
  CreateTemplateCommand,
  UpdateTemplateCommand,
  SendTemplatedEmailCommand,
  GetTemplateCommand,
} from '@aws-sdk/client-ses';
import { EmailTemplates } from './enums/email-templates.enum';
import { AssetsService } from '../assets/assets.service';

@Injectable()
export class AwsService {
  private readonly awsSesClient;

  constructor(private readonly assetsService: AssetsService) {
    this.awsSesClient = new SESClient({ region: process.env.AWS_REGION });
  }

  async generateAuthTemplate() {
    const templateName = EmailTemplates.confirmAccount;
    const subject = 'Confirm your account {{name}}';
    const templateHtmlFileName = 'confirm-account-template';
    return await this.generateTemplate(
      templateName,
      subject,
      templateHtmlFileName,
    );
  }

  async generateInvitationTemplate() {
    const templateName = EmailTemplates.userGroupInvitation;
    const subject = 'Join to a group';
    const templateHtmlFileName = 'group-invitation-template';
    return await this.generateTemplate(
      templateName,
      subject,
      templateHtmlFileName,
    );
  }
  async generateReminderTemplate() {
    const templateName = EmailTemplates.reminder;
    const subject = 'Recordatorio de carewatch';
    const templateHtmlFileName = 'reminder-execution-template';
    return await this.generateTemplate(
      templateName,
      subject,
      templateHtmlFileName,
    );
  }

  async generateTemplate(
    templateName: string,
    templateSubject: string,
    templateHtmlFileName: string,
    templateTextPart: string = 'Please enable html to see this file',
  ) {
    const templateHtmlFilePath =
      this.assetsService.getEmailTemplatePath(templateHtmlFileName);
    const templateHtmlInString =
      this.assetsService.convertFileToString(templateHtmlFilePath);
    let match: boolean;
    try {
      await this.awsSesClient.send(
        new GetTemplateCommand({ TemplateName: templateName }),
      );
      match = true;
    } catch (ex) {
      match = false;
    }
    const params = {
      Template: {
        TemplateName: templateName,
        HtmlPart: templateHtmlInString,
        SubjectPart: templateSubject,
        TextPart: templateTextPart,
      },
    };
    if (match) {
      return await this.awsSesClient.send(new UpdateTemplateCommand(params));
    }
    return await this.awsSesClient.send(new CreateTemplateCommand(params));
  }

  async sendEmail(
    sendEmailTo: string[],
    sendEmailFrom: string,
    template: string,
    templateData: string,
  ) {
    const params = {
      Destination: {
        /* required */
        CcAddresses: [
          sendEmailFrom,
          /* more items */
        ],
        ToAddresses: [
          ...sendEmailTo,
          /* more items */
        ],
      },
      Source: sendEmailFrom /* required */,
      ReplyToAddresses: [
        sendEmailFrom,
        /* more items */
      ],
      Template: template,
      TemplateData: templateData /* required */,
    };
    // Create the command and SES service object
    const sendCommand = new SendTemplatedEmailCommand(params);
    try {
      const sendResult = await this.awsSesClient.send(sendCommand);
      console.log(sendResult);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}
