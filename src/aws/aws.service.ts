import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { EmailTemplates } from './enums/email-templates.enum';
import { AssetsService } from '../assets/assets.service';
import { CreateTemplateRequest } from 'aws-sdk/clients/ses';
@Injectable()
export class AwsService {
  private readonly awsSesClient;
  constructor(private readonly assetsService: AssetsService) {
    AWS.config.update({ region: process.env.AWS_REGION });
    this.awsSesClient = new AWS.SES({ apiVersion: '2010-12-01' });
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
      await this.awsSesClient
        .getTemplate({ TemplateName: templateName })
        .promise();
      match = true;
    } catch (ex) {
      match = false;
    }
    const params: CreateTemplateRequest = {
      Template: {
        TemplateName: templateName,
        HtmlPart: templateHtmlInString,
        SubjectPart: templateSubject,
        TextPart: templateTextPart,
      },
    };
    if (match) {
      return await this.awsSesClient.updateTemplate(params).promise();
    }
    return await this.awsSesClient.createTemplate(params).promise();
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
    // Create the promise and SES service object
    const sendPromise = this.awsSesClient.sendTemplatedEmail(params).promise();
    const sendResult = await sendPromise;
    console.log(sendResult);
  }
}
