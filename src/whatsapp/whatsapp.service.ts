import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import axios from 'axios';

@Injectable()
export class WhatsappService {
  constructor(private readonly httpService: HttpService) {}

  async create(
    senderIdPhone: string = '100482656429227',
    templateName = 'hello_world',
    toPhoneNumber: number = 523325615651,
    language: string = 'en_US',
  ) {
    const token = process.env.WHATSAPP_TOKEN;
    try {
      const data = await axios.post(
        `https://graph.facebook.com/v17.0/${senderIdPhone}/messages`,
        {
          messaging_product: 'whatsapp',
          to: toPhoneNumber,
          type: 'template',
          template: {
            name: templateName,
            language: {
              code: language,
            },
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
    } catch (error) {
      console.log({ error: error.request });
      throw error;
    }
  }
}
