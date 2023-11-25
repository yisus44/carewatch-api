import { MailerService } from '@nestjs-modules/mailer';
import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { User } from 'src/users/entities/user.entity';

@Controller('mail')
export class MailController {
  constructor(
    private readonly mailerService: MailerService,
    private readonly mailService: MailService,
  ) {}
  @Get()
  async get() {
    this.mailService.sendEmailInvitation(
      'jesus.demo.44@gmail.com',
      'Cerpas',
      { name: 'Cerpas', lastName: 'cerpas' } as any as User,
      'cerpasgroup',
      'localhost:4000',
    );
    return 'mail';
  }
}
