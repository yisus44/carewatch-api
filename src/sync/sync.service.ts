import { Injectable } from '@nestjs/common';
import { SyncDto, SyncPayload } from './dto/sync.dto';
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

@Injectable()
export class SyncService {
  constructor(
    private readonly usersService: UsersService,
    private readonly userSettingsService: UserSettingsService,
    private readonly fileTypeService: FileTypeService,
    private readonly filesService: FilesService,
    private readonly frequencyTypesService: FrequencyTypesService,
    private readonly groupFilesService: GroupFilesService,
    private readonly groupsService: GroupsService,
    private readonly medicineUnitsService: MedicineUnitsService,
    private readonly medicinesService: MedicinesService,
    private readonly reminderActivationTimeService: ReminderActivationTimeService,
    private readonly reminderFilesService: ReminderFilesService,
    private readonly remindersService: RemindersService,
    private readonly scheduleService: SchedulesService,
    private readonly subscriptionsService: SubscriptionsService,
    private readonly subscriptionsHistoryService: SubscriptionsHistoryService,
    private readonly userGroupService: UserGroupService,
    private readonly weekDaysService: WeekDaysService,
  ) {}
  async toReturn(date: Date, user: User) {
    const [
      newUserSettings,
      newSubscriptions,
      newUserGroups,
      allGroups,
      allUserGroup,
      allSubscriptions,
    ] = await Promise.all([
      this.userSettingsService.list(
        {
          createdAt: MoreThanOrEqual(date),
          userId: user.id,
        },
        {},
        true,
      ),
      this.subscriptionsService.list(
        {
          createdAt: MoreThanOrEqual(date),
          userId: user.id,
        },
        {},
        true,
      ),
      this.userGroupService.list(
        {
          createdAt: MoreThanOrEqual(date),
          userId: user.id,
        },
        {},
        true,
      ),
      this.groupsService.getQueryOfGroupsFromUser(user).getMany(),
      this.userGroupService.list({
        userId: user.id,
      }),
      this.subscriptionsService.list({
        userId: user.id,
      }),
    ]);

    const groupsId = new Map<number, number>();
    const userGroupsId = new Map<number, number>();

    //iterate over all the group invitation to get the new groups and schedules
    for (const userGroup of allUserGroup) {
      const groupId = userGroup.groupId;
      const id = userGroup.id;
      groupsId.set(groupId, groupId);
      userGroupsId.set(id, id);
    }
    //iterate over all the groups from the user to get the new reminders, group files and
    const allGroupsId = new Map<number, number>();
    for (const group of allGroups) {
      allGroupsId.set(group.id, group.id);
    }

    const [
      newGroups,
      newSchedules,
      newReminders,
      allReminders,
      newGroupFiles,
      newUserSubscriptionsHistory,
    ] = await Promise.all([
      this.groupsService.list({
        id: In(Array.from(groupsId.values())),
        createdAt: MoreThanOrEqual(date),
      }),
      //get all the schedules where the user has a user group
      this.scheduleService.list({
        userGroupId: In(Array.from(userGroupsId.values())),
        createdAt: MoreThanOrEqual(date),
      }),
      this.remindersService.list({
        createdAt: MoreThanOrEqual(date),
        groupId: In(Array.from(allGroupsId.values())),
      }),
      this.remindersService.list(
        {
          groupId: In(Array.from(allGroupsId.values())),
        },
        {},
        true,
      ),
      this.groupFilesService.list({
        createdAt: MoreThanOrEqual(date),
        groupId: In(Array.from(allGroupsId.values())),
      }),
      this.subscriptionsHistoryService.list({}),
    ]);

    const allRemindersId = new Map<number, number>();

    for (const reminder of allReminders) {
      allRemindersId.set(reminder.id, reminder.id);
    }

    const [newMedicines, newReminderActivationTime, newReminderFiles] =
      await Promise.all([
        this.medicinesService.list({
          groupId: In(Array.from(allGroupsId.values())),
          createdAt: MoreThanOrEqual(date),
        }),
        this.reminderActivationTimeService.list({
          createdAt: MoreThanOrEqual(date),
          reminderId: In(Array.from(allRemindersId.values())),
        }),
        this.reminderFilesService.list({
          createdAt: MoreThanOrEqual(date),
          reminderId: In(Array.from(allRemindersId.values())),
        }),
      ]);
    const newFilesId = new Map<number, number>();

    for (const reminderFile of newReminderFiles) {
      newFilesId.set(reminderFile.fileId, reminderFile.fileId);
    }
    for (const groupFiles of newGroupFiles) {
      newFilesId.set(groupFiles.fileId, groupFiles.fileId);
    }

    const [newFiles] = await Promise.all([
      this.filesService.list({
        id: In(Array.from(newFilesId.values())),
      }),
    ]);

    const res: SyncPayload = {
      userSettings: newUserSettings,
      subscriptions: newSubscriptions,
      userGroups: newUserGroups,
      groups: newGroups,
      schedules: newSchedules,
      reminders: newReminders,
      groupFiles: newGroupFiles,
      medicines: newMedicines,
      reminderActivationTime: newReminderActivationTime,
      subscriptionHistory: newUserSubscriptionsHistory,
      files: newFiles,
    };
    return this.convertEntitesToSyncDto(res);
  }

  convertEntitesToSyncDto(syncPayload: SyncPayload) {
    const syncPayloadDemo = new SyncPayload();
    const SyncDto: SyncDto = {
      toCreate: syncPayloadDemo,
      toUpdate: syncPayloadDemo,
    };
    for (const key of Object.keys(syncPayload)) {
      const entityKey = key as keyof SyncPayload;
      for (const entity of syncPayload[entityKey]) {
        if (entity.updatedAt > entity.createdAt) {
          SyncDto['toUpdate'][entityKey].push(entity as any);
        } else {
          SyncDto['toCreate'][entityKey].push(entity as any);
        }
      }
    }

    return SyncDto;
  }

  toUpload(SyncDto: SyncDto) {}
}
