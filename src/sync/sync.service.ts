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
      //to get new groups where the user is member
      newUserGroupsOfTheUser,
      allGroups,
      allUserGroup,
      allSubscriptions,
    ] = await Promise.all([
      this.userSettingsService.list(
        {
          updatedAt: MoreThanOrEqual(date),
          userId: user.id,
        },
        {},
        true,
      ),
      this.subscriptionsService.list(
        {
          updatedAt: MoreThanOrEqual(date),
          userId: user.id,
        },
        {},
        true,
      ),
      this.userGroupService.list(
        {
          updatedAt: MoreThanOrEqual(date),
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
    //iterate over all the groups from the user to get the new reminders, group files and user groups
    const allGroupsId = new Map<number, number>();
    for (const group of allGroups) {
      allGroupsId.set(group.id, group.id);
    }

    const allSubscriptionsId = new Map<number, number>();
    for (const subscription of allSubscriptions) {
      allSubscriptionsId.set(subscription.id, subscription.id);
    }

    const [
      newGroups,
      newSchedules,
      newReminders,
      allReminders,
      newGroupFiles,
      newUserGroups,
      newUserSubscriptionsHistory,
    ] = await Promise.all([
      this.groupsService.list({
        id: In(Array.from(groupsId.values())),
        updatedAt: MoreThanOrEqual(date),
      }),
      //get all the schedules where the user has a user group
      this.scheduleService.list({
        userGroupId: In(Array.from(userGroupsId.values())),
        updatedAt: MoreThanOrEqual(date),
      }),
      this.remindersService.list({
        updatedAt: MoreThanOrEqual(date),
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
        updatedAt: MoreThanOrEqual(date),
        groupId: In(Array.from(allGroupsId.values())),
      }),
      this.userGroupService.list({
        updatedAt: MoreThanOrEqual(date),
        groupId: In(Array.from(allGroupsId.values())),
      }),
      this.subscriptionsHistoryService.list({
        updatedAt: MoreThanOrEqual(date),
        subscriptionId: In(Array.from(allSubscriptionsId.values())),
      }),
    ]);

    const allRemindersId = new Map<number, number>();

    for (const reminder of allReminders) {
      allRemindersId.set(reminder.id, reminder.id);
    }
    const allNewUserId = new Map<number, number>();

    for (const userGroup of newUserGroups) {
      allNewUserId.set(userGroup.userId, userGroup.userId);
    }

    const [
      newMedicines,
      newReminderActivationTime,
      newReminderFiles,
      newUsers,
    ] = await Promise.all([
      this.medicinesService.list({
        groupId: In(Array.from(allGroupsId.values())),
        updatedAt: MoreThanOrEqual(date),
      }),
      this.reminderActivationTimeService.list({
        updatedAt: MoreThanOrEqual(date),
        reminderId: In(Array.from(allRemindersId.values())),
      }),
      this.reminderFilesService.list({
        updatedAt: MoreThanOrEqual(date),
        reminderId: In(Array.from(allRemindersId.values())),
      }),
      this.usersService.list({
        //select the new users and the updated current user
        id: In([...Array.from(allNewUserId.values()), user.id]),
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

    const userGroups = this.userGroupService.getUnique([
      ...newUserGroupsOfTheUser,
      ...newUserGroups,
    ]);

    const users = this.usersService.getUnique(newUsers);

    const res: SyncPayload = {
      userSettings: newUserSettings,
      subscriptions: newSubscriptions,
      userGroups,
      groups: newGroups,
      schedules: newSchedules,
      reminders: newReminders,
      groupFiles: newGroupFiles,
      medicines: newMedicines,
      reminderActivationTime: newReminderActivationTime,
      subscriptionHistory: newUserSubscriptionsHistory,
      files: newFiles,
      users: users,
    };
    return this.convertEntitesToSyncDto(res, date);
  }

  convertEntitesToSyncDto(syncPayload: SyncPayload, syncDate: Date) {
    const syncPayloadToReturn = new SyncPayload();
    const syncDto: SyncDto = {
      toCreate: structuredClone(syncPayloadToReturn),
      toUpdate: structuredClone(syncPayloadToReturn),
    };
    //classify records
    for (const key of Object.keys(syncPayload)) {
      const entityKey = key as keyof SyncPayload;
      for (const entity of syncPayload[entityKey]) {
        if (syncDate <= entity.createdAt) {
          syncDto.toCreate[entityKey].push(entity as any);
        } else {
          syncDto.toUpdate[entityKey].push(entity as any);
        }
      }
    }
    return syncDto;
  }

  async toUpload(syncDto: SyncDto, user: User) {
    await this.toCreatePayload(syncDto.toCreate, user);
    await this.toUpdatePayload(syncDto.toUpdate, user);
  }

  async toUpdatePayload(syncPayload: SyncPayload, user: User) {
    await this.groupsService.batchUpdate(syncPayload.groups);
    await this.userSettingsService.batchUpdate(syncPayload.userSettings);

    await this.filesService.batchUpdate(syncPayload.files);

    await this.userGroupService.batchUpdate(syncPayload.userGroups);

    await this.groupFilesService.batchUpdate(syncPayload.groupFiles);

    await this.remindersService.batchUpdate(syncPayload.reminders);

    await this.medicinesService.batchUpdate(syncPayload.medicines);

    await this.reminderActivationTimeService.batchUpdate(
      syncPayload.reminderActivationTime,
    );

    await this.scheduleService.batchUpdate(syncPayload.schedules);
    await this.subscriptionsHistoryService.batchUpdate(
      syncPayload.subscriptionHistory,
    );

    await this.subscriptionsService.batchUpdate(syncPayload.subscriptions);
  }

  async toCreatePayload(syncPayload: SyncPayload, user: User) {
    //special implementation of the batch operation because creating extra groups
    // require some validations
    await this.groupsService.batchAdd(syncPayload.groups, user);
    await this.userSettingsService.batchCreate(syncPayload.userSettings);

    await this.filesService.batchCreate(syncPayload.files);

    await this.userGroupService.batchCreate(syncPayload.userGroups);

    await this.groupFilesService.batchCreate(syncPayload.groupFiles);

    await this.remindersService.batchCreate(syncPayload.reminders);

    await this.medicinesService.batchCreate(syncPayload.medicines);

    await this.reminderActivationTimeService.batchCreate(
      syncPayload.reminderActivationTime,
    );

    await this.scheduleService.batchCreate(syncPayload.schedules);

    await this.subscriptionsHistoryService.batchCreate(
      syncPayload.subscriptionHistory,
    );
    //special implementation of the batch operation because creating subscriptions
    //requires another implematnion

    await this.subscriptionsService.batchAdd(syncPayload.subscriptions);
  }
}
