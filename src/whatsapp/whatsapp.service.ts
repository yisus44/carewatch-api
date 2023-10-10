import { Injectable } from '@nestjs/common';
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
      Hora de aplicación: ${
        reminderActivationTime.time ??
        `Cada ${reminderActivationTime.times} ${frequencyType.name}`
      }
      Sí deseas dejar de recibir notificaciones de CareWatch por correo o deseas cambiar el medio para recibir las notificaciones ingresa al siguiente enlace ${
        process.env.DOMAIN
      }/delete/${token}
    `;
      const from = 'whatsapp:+14155238886';
      const to = `whatsapp:+${phone}`;
      await this.sendWhatsapp(body, to, from);
    } catch (error) {
      console.log(error);
    }
  }
}
