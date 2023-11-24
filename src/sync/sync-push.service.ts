import { Injectable } from '@nestjs/common';
import { SyncDto, SyncPullPayload } from './dto/sync.pull.dto';
import { UsersService } from 'src/users/users.service';
import { UserSettingsService } from 'src/user-settings/user-settings.service';
import { FileTypeService } from 'src/file-type/file-type.service';
import { FilesService } from 'src/files/files.service';
import { FrequencyTypesService } from 'src/frequency-types/frequency-types.service';
import { GroupFilesService } from 'src/group-files/group-files.service';
import { GroupsService } from 'src/groups/groups.service';
import { MedicineUnitsService } from 'src/medicine-units/medicine-units.service';
import { MedicinesService } from 'src/medicines/medicines.service';
import { ReminderActivationTimeService } from 'src/reminder-activation-time/reminder-activation-time.service';
import { ReminderFilesService } from 'src/reminder-files/reminder-files.service';
import { RemindersService } from 'src/reminders/reminders.service';
import { SchedulesService } from 'src/schedules/schedules.service';
import { SubscriptionsService } from 'src/subscriptions/subscriptions.service';
import { SubscriptionsHistoryService } from 'src/subscriptions_history/subscriptions_history.service';
import { UserGroupService } from 'src/user-groups/user-group.service';
import { WeekDaysService } from 'src/week-days/week-days.service';
import { User } from 'src/users/entities/user.entity';
import { In, MoreThanOrEqual } from 'typeorm';
import { CoreEntity } from 'src/core/entities/core-entity';
import { ReminderTimeService } from 'src/reminder-time/reminder-time.service';
import {
  SyncPushDto,
  SyncPushPayload,
  SyncPushPayloadUpdate,
} from './dto/sync.push.dto';

@Injectable()
export class SyncPushService {
  constructor(
    private readonly userSettingsService: UserSettingsService,
    private readonly filesService: FilesService,
    private readonly groupFilesService: GroupFilesService,
    private readonly groupsService: GroupsService,
    private readonly medicinesService: MedicinesService,
    private readonly remindersService: RemindersService,
    private readonly scheduleService: SchedulesService,
    private readonly userGroupService: UserGroupService,
    private readonly reminderTimeService: ReminderTimeService,
    private readonly reminderFileService: ReminderFilesService,
  ) {}

  async toUpload(syncDto: SyncPushDto, user: User) {
    await this.toCreatePayload(syncDto.toCreate, user);
    await this.toUpdatePayload(syncDto.toUpdate, user);
  }

  async toUpdatePayload(syncPayload: SyncPushPayloadUpdate, user: User) {
    await this.groupsService.batchUpdate(syncPayload.groups);
    await this.userSettingsService.batchUpdate(syncPayload.userSettings);

    await this.filesService.batchUpdate(syncPayload.files);

    await this.userGroupService.batchUpdate(syncPayload.userGroups);

    await this.groupFilesService.batchUpdate(syncPayload.groupFiles);

    await this.remindersService.batchUpdate(syncPayload.reminders);

    await this.medicinesService.batchUpdate(syncPayload.medicines);

    await this.reminderTimeService.batchUpdate(syncPayload.reminderTimes);

    await this.scheduleService.batchUpdate(syncPayload.schedules);

    await this.reminderFileService.batchUpdate(syncPayload.reminderFiles);

    // await this.subscriptionsHistoryService.batchUpdate(
    //   syncPayload.subscriptionHistory,
    // );

    // await this.subscriptionsService.batchUpdate(syncPayload.subscriptions);
  }

  async toCreatePayload(syncPayload: SyncPushPayload, user: User) {
    //special implementation of the batch operation because creating extra groups
    // require some validations
    // await this.groupsService.batchAdd(syncPayload.groups, user);
    await this.userSettingsService.batchCreate(syncPayload.userSettings);

    await this.filesService.batchCreate(syncPayload.files);

    // await this.userGroupService.batchCreate(syncPayload.userGroups);

    await this.groupFilesService.batchCreate(syncPayload.groupFiles);

    await this.remindersService.batchCreate(syncPayload.reminders);

    await this.medicinesService.batchCreate(syncPayload.medicines);

    await this.reminderTimeService.batchAdd(syncPayload.reminderTimes);

    await this.scheduleService.batchCreate(syncPayload.schedules);

    await this.reminderFileService.batchCreate(syncPayload.reminderFiles);

    // await this.subscriptionsHistoryService.batchCreate(
    //   syncPayload.subscriptionHistory,
    // );
    //special implementation of the batch operation because creating subscriptions
    //requires another implematnion

    // await this.subscriptionsService.batchAdd(syncPayload.subscriptions);
  }
}
