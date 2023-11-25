import { MailerService } from '@nestjs-modules/mailer';
import { Controller, Get } from '@nestjs/common';

@Controller('mail')
export class MailController {
  constructor(private readonly mailerService: MailerService) {}
  @Get()
  get() {
    this.mailerService
      .sendMail({
        to: 'jesusadrian1953.1@gmail.com', // list of receivers
        from: 'Carewatch en equipo', // sender address
        subject: 'Testing Nest MailerModule ✔', // Subject line
        text: 'welcome', // plaintext body,
        sender: 'Carewatch',
        html: '<b>welcome</b>', // HTML body content
      })
      .then(() => {})
      .catch(() => {});
    return 'mail';
  }
}
