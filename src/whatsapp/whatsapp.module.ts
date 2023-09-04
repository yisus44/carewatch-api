import { Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { WhatsappController } from './whatsapp.controller';
import { HttpModule } from '@nestjs/axios';
import { Twilio } from 'twilio';

@Module({
  controllers: [WhatsappController],
  providers: [
    {
      provide: Twilio,
      useFactory: async () =>
        new Twilio(
          process.env.TWILIO_ACCOUNT_SID,
          process.env.TWILIO_AUTH_TOKEN,
        ),
    },
    WhatsappService,
  ],
  imports: [HttpModule],
  exports: [WhatsappService],
})
export class WhatsappModule {}
