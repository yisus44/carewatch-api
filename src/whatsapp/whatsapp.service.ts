import { BadRequestException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import axios from 'axios';
import { WhatsAppTemplates } from './enums/whatsapp-templates.enum';
import { User } from 'src/users/entities/user.entity';
import { Twilio } from 'twilio';
import { Reminder } from 'src/reminders/entities/reminder.entity';
import { Medicine } from 'src/medicines/entities/medicine.entity';
import { Group } from 'src/groups/entities/group.entity';
import { ReminderActivationTime } from 'src/reminder-activation-time/entities/reminder-activation-time.entity';
import { FrequencyType } from 'src/frequency-types/entities/frequency-type.entity';
import { CommonService } from 'src/common/common.service';
@Injectable()
export class WhatsappService {
  constructor(
    private readonly client: Twilio,
    private readonly commonService: CommonService,
  ) {}
  async sendMessage(phoneWithInternationalNumber: string, message: string) {
    const idInstance = process.env.GREEN_API_ID_INSTANCE;
    const apiTokenInstance = process.env.GREEN_API_TOKEN_INSTANCE;

    const url = `https://api.greenapi.com/waInstance${idInstance}/sendMessage/${apiTokenInstance}`;

    const payload = {
      chatId: `${phoneWithInternationalNumber}@c.us`,
      message: message,
    };

    const headers = {
      'Content-Type': 'application/json',
    };

    try {
      const response = await axios.post(url, payload, { headers });
      return response.data;
    } catch (error) {
      throw new BadRequestException(`Failed to send message: ${error.message}`);
    }
  }
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
    invitedUser: string,
    adminUser: User,
    groupName: string,
    link: string,
  ) {
    try {
      const body = `Hola ${invitedUser}, ¡${adminUser.name} ${adminUser.lastName} te ha invitado a formar parte de su grupo ${groupName} de Carewatch!

      Carewatch es una aplicación móvil comprometida con la sociedad, apoyando al cuidado de tu ser querido, para que puedas realizar sus cuidados con las indicaciones del médico y facilitándote la organización de los horarios de los cuidadores.
      
      Si deseas unirte al grupo o conocer más acerca de nuestra aplicación, sigue el siguiente enlace ${link}`;
      await this.sendMessage(phone.toString(), body);
    } catch (error) {
      console.log(error);
    }
  }
  async sendWhatsappReminderWithFrequencyString(
    userName: string,
    phone: number,
    reminder: Reminder,
    medicine: Medicine,
    group: Group,
    frequency: string,
    token: string,
  ) {
    try {
      const body = `
      Hola ${userName}!
      
      Carewatch te recuerda que es tu turno de apoyar en tu grupo ${group.name}
      
      ***********RECORDATORIO***********
      
      Medicamento: ${medicine.name}
      Dosis: ${reminder.dosis}
      Detalles adicionales: ${reminder.additionalDetails}
      Aplicación: ${frequency}
      
      Si deseas dejar de recibir notificaciones de Carewatch por correo o deseas cambiar el medio para recibir las notificaciones, ingresa al siguiente enlace ${process.env.DOMAIN}/delete/${token}
      `;
      await this.sendMessage(phone.toString(), body);
    } catch (error) {
      console.log(error);
    }
  }
  async sendWhatsappReminder(
    userName: string,
    phone: number,
    reminder: Reminder,
    medicine: Medicine,
    group: Group,
    reminderActivationTime: ReminderActivationTime,
    frequencyType: FrequencyType,
    token: string,
  ) {
    try {
      const body = `
      Hola ${userName}!
      
      Carewatch te recuerda que es tu turno de apoyar en tu grupo ${group.name}
      
      ***********RECORDATORIO***********
      
      Medicamento: ${medicine.name}
      Dosis: ${reminder.dosis}
      Detalles adicionales: ${reminder.additionalDetails}
      Aplicación: ${this.commonService.buildFrequencyString(
        reminderActivationTime,
        frequencyType,
      )}
      Sí deseas dejar de recibir notificaciones de Carewatch por correo o deseas cambiar el medio para recibir las notificaciones ingresa al siguiente enlace ${
        process.env.DOMAIN
      }/delete/${token}
    `;
      await this.sendMessage(phone.toString(), body);
    } catch (error) {
      console.log(error);
    }
  }

  async getAvailability(phoneNumber: string) {
    const idInstance = process.env.GREEN_API_ID_INSTANCE;
    const apiTokenInstance = process.env.GREEN_API_TOKEN_INSTANCE;

    const url = `https://api.greenapi.com/waInstance${idInstance}/checkWhatsapp/${apiTokenInstance}`;

    const payload = {
      phoneNumber,
    };

    const headers = {
      'Content-Type': 'application/json',
    };

    try {
      const response = await axios.post(url, payload, { headers });
      return response.data;
    } catch (error) {
      throw new BadRequestException(`Failed to send message: ${error.message}`);
    }
  }
}
