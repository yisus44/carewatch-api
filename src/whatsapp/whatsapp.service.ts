import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import axios from 'axios';
import { WhatsAppTemplates } from './enums/whatsapp-templates.enum';
import { User } from 'src/users/entities/user.entity';
import { Twilio } from 'twilio';
@Injectable()
export class WhatsappService {
  constructor(private readonly client: Twilio) {}

  async sendWhatsapp(
    body: string,
    to: string,
    from: string = 'whatsapp:+14155238886',
  ) {
    try {
      await this.client.messages.create({
        body,
        from,
        to,
      });
    } catch (error) {
      console.log({ error });
      throw error;
    }
  }
  async sendWhatsAppInvitation(
    phone: number,
    invitatedUser: string,
    adminUser: User,
    groupName: string,
    link: string,
  ) {
    try {
      const body = `Hola ${invitatedUser}, ¡${adminUser.name} ${adminUser.lastName} te ha invitado a formar parte de su grupo ${groupName} de Carewatch!  
  
      CareWatch es una applicación movil comprometida con la sociedad, apoyando al cuidado de tu ser querido, para que puedas realizar sus cuidados con las indicaciones del medico y facilitandote la organización de los horarios de los cuidadores
      
      Sí deseas unirte al grupo o conocer más acerca de nuestra aplicación sigue el siguiente enlace ${link}`;
      const from = 'whatsapp:+14155238886';
      const to = `whatsapp:+${phone}`;
      await this.sendWhatsapp(body, to, from);
    } catch (error) {
      console.log(error);
    }
  }
}
