import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { AwsModule } from '../aws/aws.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { MailController } from './mail.controller';

@Module({
  providers: [MailService],
  exports: [MailService],
  controllers: [MailController],
  imports: [
    AwsModule,
    MailerModule.forRoot({
      // transport: 'smtps://user@example.com:topsecret@smtp.example.com',
      // or
      transport: {
        host: 'smtp.gmail.com',
        secure: false,
        auth: {
          user: 'blog27768@gmail.com',
          pass: 'kmml ozro dfqo zyrj',
        },
      },
      defaults: {
        from: '"No Reply" <noreply@example.com>',
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
        options: {
          strict: true,
        },
      },
    }),
  ],
})
export class MailModule {}
