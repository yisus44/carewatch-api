import { Injectable } from '@nestjs/common';
import { AwsService } from '../aws/aws.service';
import { EmailTemplates } from '../aws/enums/email-templates.enum';
import { User } from '../users/entities/user.entity';
import { Reminder } from 'src/reminders/entities/reminder.entity';
import { Medicine } from 'src/medicines/entities/medicine.entity';
import { Group } from 'src/groups/entities/group.entity';
import { ReminderActivationTime } from 'src/reminder-activation-time/entities/reminder-activation-time.entity';
import { FrequencyType } from 'src/frequency-types/entities/frequency-type.entity';
import { CommonService } from 'src/common/common.service';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly awsService: AwsService,
    private readonly commonService: CommonService,
  ) {}

  async sendEmailInvitation(
    email: string,
    invitatedUser: string,
    adminUser: User,
    groupName: string,
    link: string,
  ) {
    const adminUserString = `${adminUser.name} ${adminUser.lastName}`;
    const body = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Invitacion a un grupo</title>
      </head>
      <body>
        Hola ${invitatedUser}, ¡${adminUserString} te ha invitado a formar parte de su
        grupo ${groupName} de Carewatch! Carewatch es una applicación movil
        comprometida con la sociedad, apoyando al cuidado de tu ser querido , para
        que puedas realizar sus cuidados con las indicaciones del medico y
        facilitandote la organización de los horarios de los cuidadores Sí deseas
        unirte al grupo o conocer más acerca de nuestra aplicación sigue el
        siguiente enlace ${link}
      </body>
    </html>
    `;
    return await this.mailerService.sendMail({
      to: email, // list of receivers
      from: 'carewatch@carewatch-en-equipo.com', // sender address
      subject: 'Invitacion a un grupo', //Envia
      sender: 'Carewatch',
      html: body,
    });
  }

  async sendMailReminder(
    userName: string,
    email: string,
    reminder: Reminder,
    medicine: Medicine,
    group: Group,
    reminderActivationTime: ReminderActivationTime,
    frequencyType: FrequencyType,
    token: string,
  ) {
    await this.awsService.generateReminderTemplate();
    this.awsService.sendEmail(
      [email],
      'jesusadrian1953.1@gmail.com',
      EmailTemplates.reminder,
      JSON.stringify({
        userName,
        medicineName: medicine.name,
        groupName: group.name,
        dosis: reminder.dosis,
        aditionalDetails: reminder.additionalDetails,
        time: this.commonService.buildFrequencyString(
          reminderActivationTime,
          frequencyType,
        ),
        domain: ` ${process.env.DOMAIN}/delete/${token}`,
      }),
    );
  }

  async sendMailReminderWithFrequencyString(
    userName: string,
    email: string,
    reminder: Reminder,
    medicine: Medicine,
    group: Group,
    frequency: string,
    token: string,
  ) {
    const medicineName = medicine.name;
    const groupName = group.name;
    const dosis = reminder.dosis;
    const aditionalDetails = reminder.additionalDetails;
    const time = frequency;
    const domain = ` ${process.env.DOMAIN}/delete/${token}`;
    const body = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Reminder</title>
      </head>
      <body>
        <h1>Recordatorio Carewatch, ${{ userName }}</h1>
        Grupo : ${{ groupName }}
        <br />
        Medicamento: ${{ medicineName }} <br />Dosis: ${{
      dosis,
    }} <br />Detalles
        adicionales: ${{ aditionalDetails }} <br />Hora de aplicación: ${{
      time,
    }}
        <br />Sí deseas dejar de recibir notificaciones de Carewatch o deseas
        cambiar el medio para recibir las notificaciones ingresa al siguiente enlace
        ${{ domain }}
      </body>
    </html>
    `;
    return await this.mailerService.sendMail({
      to: email, // list of receivers
      from: 'carewatch@carewatch-en-equipo.com', // sender address
      subject: 'Recordatorio de carewatch', //Envia
      sender: 'Carewatch',
      html: body,
    });
  }
  async demoEmail() {
    this.awsService.generateAuthTemplate();
    this.awsService.sendEmail(
      ['jesusadrian1953.1@gmail.com'],
      'jesusadrian1953.1@gmail.com',
      EmailTemplates.confirmAccount,
      JSON.stringify({ name: 'peso pluma' }),
    );
  }
}
