import { Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { WhatsappController } from './whatsapp.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [WhatsappController],
  providers: [WhatsappService],
  imports: [HttpModule],
})
export class WhatsappModule {}
