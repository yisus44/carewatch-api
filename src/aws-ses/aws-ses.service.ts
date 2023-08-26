import { Injectable } from '@nestjs/common';
import { SES } from 'aws-sdk';
import { AssetsService } from '../assets/assets.service';
import { CreateTemplateRequest } from 'aws-sdk/clients/ses';

import { EmailTemplates } from '../aws/enums/email-templates.enum';

@Injectable()
export class AwsSesService {
  constructor(
    private readonly assetsService: AssetsService,
    private readonly awsSesClient: SES,
  ) {}

  async generateAuthTemplate() {
    const templateName = EmailTemplates.confirmAccount;
    const subject = 'Confirm your account {{name}}';
    const templateHtmlFileName = 'confirm-account-template';
    console.log(this.awsSesClient);
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
    console.log(sendResult.MessageId);
  }

  findAll() {
    return `This action returns all awsSes`;
  }
}
