import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';

@Controller('whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Get('/availability')
  async getAvailability(@Query('phone') phoneNumber: string) {
    if (!phoneNumber) throw new BadRequestException('Missing phone number');
    return this.whatsappService.getAvailability(phoneNumber);
  }
}
