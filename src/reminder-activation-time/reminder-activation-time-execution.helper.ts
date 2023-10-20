import { Injectable } from '@nestjs/common';
import { ReminderActivationTime } from './entities/reminder-activation-time.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FrequencyTypesService } from 'src/frequency-types/frequency-types.service';
import {
  FrequencyType,
  FrequencyTypeEnum,
} from 'src/frequency-types/entities/frequency-type.entity';
import { ReminderExecutionService } from 'src/reminder-execution/reminder-execution.service';
import { WhatsappService } from 'src/whatsapp/whatsapp.service';
import { MailService } from 'src/mail/mail.service';
import { RemindersService } from 'src/reminders/reminders.service';
import { MedicinesService } from 'src/medicines/medicines.service';
import { GroupsService } from 'src/groups/groups.service';

@Injectable()
export class ReminderActivationTimeHelperExecution {
  constructor(
    @InjectRepository(ReminderActivationTime)
    private readonly reminderActivationTimeRepository: Repository<ReminderActivationTime>,
    private readonly whatsAppService: WhatsappService,
    private readonly mailService: MailService,
    private readonly reminderExecutionService: ReminderExecutionService,
    private readonly reminderService: RemindersService,
    private readonly medicineService: MedicinesService,
    private readonly groupService: GroupsService,
    private readonly frequencyTypeService: FrequencyTypesService,
  ) {}

  async executeReminder(
    reminderId: number,
    reminderActivationTime: ReminderActivationTime,
  ) {
    try {
      const reminder = await this.reminderService.findOneById(reminderId);
      const group = await this.groupService.findOneById(reminder.groupId);
      const medicine = await this.medicineService.findOneById(
        reminder.medicineId,
      );
      const frequencyType = await this.frequencyTypeService.findOneById(
        reminderActivationTime.frequencyTypeId,
      );
      let nameToSend;
      let phoneToSend;
      let mailToSend;
      console.log({ executed: new Date() });
      const data = await this.reminderActivationTimeRepository.query(
        `
        WITH active_users AS (
          SELECT
               schedule.user_group_id
          FROM schedule
          JOIN week_day
          ON week_day.id = schedule.week_day_id
              WHERE
                  CAST(start_time AS TIME) < CURRENT_TIME AT TIME ZONE 'UTC' AT TIME ZONE schedule.time_zone
              AND
                  CAST(end_time AS TIME) > CAST(CURRENT_TIME AT TIME ZONE 'UTC' AT TIME ZONE schedule.time_zone AS TIME )
              AND
                EXTRACT(DOW FROM now() AT TIME ZONE schedule.time_zone) = week_day.week_day_number
              AND
                schedule.deleted_at is not null 
              )
          /*Join the information*/
          SELECT
              /*If we should send whatsapp or email or both*/
              email_communication, whats_app_communication,
              /*Where we will send in case of a guest*/
              guest_email, guest_name, guest_name, guest_phone,
               /*Where we will send in case of a carewatch user*/
              name, last_name, email, phone, token
          FROM active_users
          JOIN user_group
          on user_group.id = active_users.user_group_id
          LEFT JOIN public.user AS usr
          ON usr.id = user_group.user_id
              WHERE 
                user_group.group_id = $1 
              AND 
                user_group.is_active = true
              AND
                user_group.deleted_at is not null
            `,
        [group.id],
      );
      for (const invitation of data) {
        const promiseArr = [];
        const {
          email_communication,
          whats_app_communication,
          guest_email,
          guest_name,
          guest_phone,
          name,
          last_name,
          email,
          phone,
          token,
        } = invitation;
        if (guest_phone) {
          phoneToSend = guest_phone;
        }
        if (guest_email) {
          mailToSend = guest_email;
        }
        if (phone) {
          phoneToSend = phone;
        }
        if (email) {
          mailToSend = email;
        }
        if (name) {
          nameToSend = `${name} ${last_name}`;
        }
        if (guest_name) {
          nameToSend = guest_name;
        }

        if (whats_app_communication && phoneToSend) {
          promiseArr.push(
            this.whatsAppService.sendWhatsappReminder(
              nameToSend,
              phoneToSend,
              reminder,
              medicine,
              group,
              reminderActivationTime,
              frequencyType,
              token,
            ),
          );
        }
        if (email_communication && mailToSend) {
          promiseArr.push(
            this.mailService.sendMailReminder(
              nameToSend,
              mailToSend,
              reminder,
              medicine,
              group,
              reminderActivationTime,
              frequencyType,
              token,
            ),
          );
        }
        await Promise.all(promiseArr);
      }
    } catch (error) {
      console.log({ error });
    }
  }

  async handleExecution(
    reminderActivationTime: ReminderActivationTime,
    frequencyType: FrequencyType,
  ) {
    const executeReminderFunction = async () => {
      await this.executeReminder(
        reminderActivationTime.reminderId,
        reminderActivationTime,
      );
    };
    switch (frequencyType.name) {
      case FrequencyTypeEnum.SPECIFC_DATE: {
        this.reminderExecutionService.createOrUpdateSpecificDate(
          reminderActivationTime.time.toString(),
          reminderActivationTime.frequencyValue,
          reminderActivationTime.id.toString(),
          executeReminderFunction,
        );
        break;
      }
      case FrequencyTypeEnum.SPECIFC_WEEKDAY: {
        this.reminderExecutionService.createOrUpdateSpecificDayOfTheWeek(
          reminderActivationTime.time.toString(),
          reminderActivationTime.frequencyValue,
          reminderActivationTime.id.toString(),
          executeReminderFunction,
        );
        break;
      }
      case FrequencyTypeEnum.SECOND:
      case FrequencyTypeEnum.MINUTE:
      case FrequencyTypeEnum.HOUR:
      case FrequencyTypeEnum.DAY: {
        this.reminderExecutionService.createOrUpdateFrequency(
          reminderActivationTime.intialDateTime.toString(),
          reminderActivationTime.frequencyValue,
          reminderActivationTime.id.toString(),
          executeReminderFunction,
        );
        break;
      }
    }
  }
}
