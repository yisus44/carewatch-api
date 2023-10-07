import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CoreService } from 'src/core/core.service';
import { ReminderActivationTime } from './entities/reminder-activation-time.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReminderActivationTimeDto } from './dto/create-reminder-activation-time.dto';
import { FrequencyTypesService } from 'src/frequency-types/frequency-types.service';
import { RelationDoNotExistsException } from 'src/common/exceptions/relation-do-not-exists.exception';
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
import { UpdateReminderActivationTimeDto } from './dto/update-reminder-activation-time.dto';

@Injectable()
export class ReminderActivationTimeService extends CoreService<ReminderActivationTime> {
  constructor(
    @InjectRepository(ReminderActivationTime)
    private readonly reminderActivationTimeRepository: Repository<ReminderActivationTime>,
    private readonly frequencyTypeService: FrequencyTypesService,
    private readonly reminderExecutionService: ReminderExecutionService,
    private readonly whatsAppService: WhatsappService,
    private readonly mailService: MailService,
    private readonly reminderService: RemindersService,
    private readonly medicineService: MedicinesService,
    private readonly groupService: GroupsService,
  ) {
    super(reminderActivationTimeRepository);
  }
  override async create(
    createReminderActivationTimeDto: CreateReminderActivationTimeDto,
  ): Promise<ReminderActivationTime> {
    const frequencyType = await this.frequencyTypeService.findOneById(
      createReminderActivationTimeDto.frequencyTypeId,
    );
    if (!frequencyType) throw new RelationDoNotExistsException();
    let reminderActivationTime;
    if (
      frequencyType.name === FrequencyTypeEnum.SPECIFC_DATE ||
      frequencyType.name === FrequencyTypeEnum.SPECIFC_WEEKDAY
    ) {
      reminderActivationTime = await super.create({
        ...createReminderActivationTimeDto,
        intialDateTime: null,
      });
    } else {
      //when we want to execute the reminder
      // every x numbers seconds, minutes, hours and day
      reminderActivationTime = await super.create({
        ...createReminderActivationTimeDto,
        intialDateTime:
          createReminderActivationTimeDto.intialDateTime ?? new Date(),
        time: null,
      });
    }

    await this.handleExecution(reminderActivationTime, frequencyType);
    return reminderActivationTime;
  }

  override async update(
    id: number,
    updateReminderActivationTimeDto: UpdateReminderActivationTimeDto,
  ) {
    let reminderActivationTime = await this.findOneById(id);
    if (!reminderActivationTime) throw new NotFoundException();
    let frequencyType;
    let result;
    if (updateReminderActivationTimeDto.frequencyTypeId) {
      frequencyType = await this.frequencyTypeService.findOneById(
        updateReminderActivationTimeDto.frequencyTypeId,
      );
    } else {
      frequencyType = await this.frequencyTypeService.findOneById(
        reminderActivationTime.frequencyTypeId,
      );
    }
    if (!frequencyType) throw new RelationDoNotExistsException();
    if (
      frequencyType.name === FrequencyTypeEnum.SPECIFC_DATE ||
      frequencyType.name === FrequencyTypeEnum.SPECIFC_WEEKDAY
    ) {
      result = await super.update(id, {
        ...updateReminderActivationTimeDto,
        intialDateTime: null,
      });
    } else {
      //when we want to execute the reminder
      // every x numbers seconds, minutes, hours and day
      result = await super.update(id, {
        ...updateReminderActivationTimeDto,
        intialDateTime:
          updateReminderActivationTimeDto.intialDateTime ?? new Date(),
        time: null,
      });
    }
    reminderActivationTime = await this.findOneById(id);
    await this.handleExecution(reminderActivationTime, frequencyType);
    return result;
  }

  async executeReminder(
    reminderId: number,
    reminderActivationTime: ReminderActivationTime,
  ) {
    const reminder = await this.reminderService.findOneById(reminderId);
    const group = await this.groupService.findOneById(reminder.groupId);
    const medicine = await this.medicineService.findOneById(
      reminder.medicineId,
    );
    let nameToSend;
    let phoneToSend;
    let mailToSend;
    const data = await this.reminderActivationTimeRepository.query(
      `
      WITH active_users AS  (
        SELECT
           schedule.user_group_id
        FROM schedule
        JOIN week_day
        ON week_day.id = schedule.week_day_id
            WHERE
                CAST(start_time AS TIME) < CURRENT_TIME AT TIME ZONE 'UTC' AT TIME ZONE 'America/Mexico_City'
            AND
                CAST(end_time AS TIME) > CAST(CURRENT_TIME AT TIME ZONE 'UTC' AT TIME ZONE 'America/Mexico_City' AS TIME )
            AND
                EXTRACT(DOW FROM CURRENT_DATE  AT TIME ZONE 'America/Mexico_City') = week_day.week_day_number
            )
        /*Join the information*/
        SELECT
            /*If we should send whatsapp or email or both*/
            email_communication, whats_app_communication,
            /*Where we will send in case of a guest*/
            guest_email, guest_name, guest_name, guest_phone,
             /*Where we will send in case of a carewatch user*/
            name,last_name, email, phone, token
        FROM active_users
        JOIN user_group
        on user_group.id = active_users.user_group_id
        LEFT JOIN public.user AS usr
        ON usr.id = user_group.user_id
            WHERE user_group.group_id = 21
            AND user_group.is_active = true
          `,
      // [group.id],
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
            token,
          ),
        );
      }
      if (email_communication && mailToSend) {
      }
      await Promise.all(promiseArr);
    }
  }

  async remove(id: number) {
    this.reminderExecutionService.removeSpecificDate(id.toString());
    return super.remove(id);
  }

  async handleExecution(
    reminderActivationTime: ReminderActivationTime,
    frequencyType: FrequencyType,
  ) {
    switch (frequencyType.name) {
      case FrequencyTypeEnum.SPECIFC_DATE: {
        console.log([reminderActivationTime]);
        this.reminderExecutionService.createOrUpdateSpecificDate(
          reminderActivationTime.time.toString(),
          reminderActivationTime.frequencyValue,
          reminderActivationTime.id.toString(),
          async () => {
            console.log('callback');
            await this.executeReminder(
              reminderActivationTime.id,
              reminderActivationTime,
            );
          },
        );
      }
      case FrequencyTypeEnum.SPECIFC_WEEKDAY: {
      }
    }
  }
}
