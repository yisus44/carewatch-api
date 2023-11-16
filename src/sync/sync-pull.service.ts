import { Injectable } from '@nestjs/common';
import { SyncDto, SyncPullPayload, SyncSpecialDto } from './dto/sync.pull.dto';
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
import { Equal, In, MoreThanOrEqual } from 'typeorm';
import { CoreEntity } from 'src/core/entities/core-entity';
import { PullSyncDto } from './dto/sync-group.pull.dto';
import { ReminderTimeService } from 'src/reminder-time/reminder-time.service';

@Injectable()
export class SyncPullService {
  constructor(
    private readonly usersService: UsersService,
    private readonly userSettingsService: UserSettingsService,
    private readonly filesService: FilesService,
    private readonly groupFilesService: GroupFilesService,
    private readonly groupsService: GroupsService,
    private readonly medicinesService: MedicinesService,
    private readonly reminderFilesService: ReminderFilesService,
    private readonly remindersService: RemindersService,
    private readonly scheduleService: SchedulesService,
    private readonly subscriptionsService: SubscriptionsService,
    private readonly subscriptionsHistoryService: SubscriptionsHistoryService,
    private readonly userGroupService: UserGroupService,
    private readonly reminderTimeSerivce: ReminderTimeService,
  ) {}

  async pullGroupInfo(groupId: number, user: User, syncDate: Date) {
    //this is needed to ensure the date recevied is a date and is not parsed as a string
    // as per the writing of this comment, sometimes happens
    const toSyncDate = new Date(syncDate);

    const userGroup = await this.userGroupService.findOneBy({
      groupId,
      userId: user.id,
    });

    const groupPromise = this.groupsService.findOneBy({
      id: groupId,
      updatedAt: MoreThanOrEqual(toSyncDate),
    });
    const newUserGroupsPromise = this.userGroupService.list({
      updatedAt: MoreThanOrEqual(toSyncDate),
      groupId,
    });
    const allUserGroupsPromise = this.userGroupService.list({
      groupId,
    });

    const allRemindersPromise = this.remindersService.list({
      groupId,
    });
    const groupsFilesPromise = this.groupFilesService.list({
      updatedAt: MoreThanOrEqual(toSyncDate),
      groupId,
    });

    const medicinesPromise = this.medicinesService.list({
      updatedAt: MoreThanOrEqual(toSyncDate),
      groupId,
    });

    const remindersPromise = this.remindersService.list({
      updatedAt: MoreThanOrEqual(toSyncDate),
      groupId,
    });

    const schedulesPromise = this.scheduleService.list({
      updatedAt: MoreThanOrEqual(toSyncDate),
      userGroupId: userGroup.id,
    });

    const [
      group,
      userGroups,
      allUserGroups,
      groupFiles,
      medicines,
      reminders,
      allReminders,
      schedules,
    ] = await Promise.all([
      groupPromise,
      newUserGroupsPromise,
      allUserGroupsPromise,
      groupsFilesPromise,
      medicinesPromise,
      remindersPromise,
      allRemindersPromise,
      schedulesPromise,
    ]);
    const reminderTimePromise = [];
    const reminderFilePromise = [];

    for (const reminder of allReminders) {
      reminderTimePromise.push(
        this.reminderTimeSerivce.list({
          updatedAt: MoreThanOrEqual(toSyncDate),
          reminderId: reminder.id,
        }),
      );
      reminderFilePromise.push(
        this.reminderFilesService.list({
          updatedAt: MoreThanOrEqual(toSyncDate),
          reminderId: reminder.id,
        }),
      );
    }
    const reminderTimes = (await Promise.all(reminderTimePromise)).flat();
    const reminderFiles = (await Promise.all(reminderFilePromise)).flat();

    const usersId = [];
    const filesId = [];

    const updatedUsersPromise = [];
    for (const userGroup of allUserGroups) {
      if (!userGroup.userId) continue;
      updatedUsersPromise.push(
        this.usersService.findOneBy({
          id: userGroup.userId,
          updatedAt: MoreThanOrEqual(toSyncDate),
        }),
      );
    }
    const updatedUsers = await Promise.all(updatedUsersPromise);
    //get specials ids

    for (const updatedUser of updatedUsers) {
      usersId.push(updatedUser ? updatedUser.id : null);
    }
    for (const userGroup of userGroups) {
      usersId.push(userGroup.userId);
    }

    for (const groupFile of groupFiles) {
      filesId.push(groupFile.fileId);
    }
    for (const reminderFile of reminderFiles) {
      filesId.push(reminderFile.fileId);
    }

    return {
      usersId,
      filesId,
      syncDate,
      data: {
        groups: group ? [group] : [],
        userGroups,
        groupFiles,
        medicines,
        reminders,
        reminderTimes,
        reminderFile: reminderFiles,
        schedules,
      },
    };
  }
  convertEntitesToSyncDto(syncPayload: SyncPullPayload, syncDate: Date) {
    const syncPayloadToReturn = new SyncPullPayload();
    const syncDto: SyncDto = {
      toCreate: structuredClone(syncPayloadToReturn),
      toUpdate: structuredClone(syncPayloadToReturn),
      special: {
        subscriptionHistory: [],
        subscriptions: [],
        userSettings: [],
        files: [],
        users: [],
      },
    };
    //classify records
    for (const key of Object.keys(syncPayload)) {
      const entityKey = key as keyof SyncPullPayload;
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
  async pullExternalInfo(
    usersId: number[],
    filesId: number[],
    user: User,
    syncDate: Date,
  ) {
    const userChanges = await this.usersService.findOneBy({
      id: user.id,
      updatedAt: MoreThanOrEqual(syncDate),
    });
    if (userChanges) {
      usersId.push(userChanges.id);
    }
    const sanitizedUsersId = this.sanitizeArrayOfId(usersId);
    const sanitizeFilesId = this.sanitizeArrayOfId(filesId);

    const usersPromise = this.usersService.list({
      id: In(sanitizedUsersId),
    });
    const filesPromise = this.filesService.list({
      id: In(sanitizeFilesId),
    });

    const [users, files] = await Promise.all([usersPromise, filesPromise]);
    return { users, files };
  }

  async pullSpecialInfo(user: User, syncDate: Date) {
    const [newUserSettings, newSubscriptions, allSubscriptions] =
      await Promise.all([
        this.userSettingsService.list(
          {
            updatedAt: MoreThanOrEqual(syncDate),
            userId: user.id,
          },
          {},
          true,
        ),
        this.subscriptionsService.list(
          {
            updatedAt: MoreThanOrEqual(syncDate),
            userId: user.id,
          },
          {},
          true,
        ),

        this.subscriptionsService.list({
          userId: user.id,
        }),
      ]);

    const allSubscriptionsId = new Map<number, number>();
    for (const subscription of allSubscriptions) {
      allSubscriptionsId.set(subscription.id, subscription.id);
    }
    const newUserSubscriptionsHistory =
      await this.subscriptionsHistoryService.list({
        updatedAt: MoreThanOrEqual(syncDate),
        subscriptionId: In(Array.from(allSubscriptionsId.values())),
      });

    return {
      userSettings: newUserSettings,
      subscriptions: newSubscriptions,
      subscriptionHistory: newUserSubscriptionsHistory,
      syncDate,
    };
  }

  sanitizeArrayOfId(ids: number[]) {
    const notNullIds = ids.filter((id) => id);
    const uniqueIdSet = new Set(notNullIds);
    return [...uniqueIdSet];
  }

  async getGroupInfo(pullullSyncDto: PullSyncDto, user: User) {
    const groupSyncInfoPromise = [];
    for (const groupSyncInfo of pullullSyncDto.syncGroups) {
      groupSyncInfoPromise.push(
        this.pullGroupInfo(groupSyncInfo.groupId, user, groupSyncInfo.syncDate),
      );
    }
    const groupsSyncInfo = await Promise.all(groupSyncInfoPromise);
    return groupsSyncInfo;
  }
  async flatSyncDtos(syncsDto: SyncDto[]) {
    const syncDto = new SyncDto();
    for (const groupInfo of syncsDto) {
      for (const collection of Object.keys(groupInfo)) {
        //know if this is the first time flatting
        const cachedKey = collection as keyof SyncDto;
        const cachedValue = syncDto[cachedKey];
        const newValue = groupInfo[cachedKey];
        if (cachedKey == 'special') continue;
        if (!cachedValue) {
          //if its the first time, then we assign whatever we have
          syncDto[cachedKey] = groupInfo[cachedKey] as any;
        } else {
          //if not then we are going to combine both collections
          for (const collection of Object.keys(cachedValue)) {
            const key = collection as keyof SyncPullPayload;
            const previuosEntities = (cachedValue as SyncPullPayload)[key];
            const newEntities = (newValue as SyncPullPayload)[key];
            //results of both collections
            const combinedCollection = [...previuosEntities, ...newEntities];
            //then we are going to filter based on the id
            const newElements = [];
            const cache: any = {};
            for (const element of combinedCollection) {
              if (!cache[element.id]) {
                cache[element.id] = element;
                newElements.push(element);
                continue;
              }
            }
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            syncDto[cachedKey][key] = newElements;
          }
        }
      }
    }
    return syncDto;
  }
  async toReturn(pullSyncDto: PullSyncDto, user: User) {
    const groupsSyncInfo = await this.getGroupInfo(pullSyncDto, user);
    const syncInfo = [];
    for (const groupInfo of groupsSyncInfo) {
      const payload: SyncPullPayload = {
        ...groupInfo.data,
      };
      syncInfo.push(
        this.convertEntitesToSyncDto(payload, new Date(groupInfo.syncDate)),
      );
    }
    const syncInfoFlattened = await this.flatSyncDtos(syncInfo);
    const usersId = groupsSyncInfo.map((group) => group.usersId).flat();
    const filesId = groupsSyncInfo.map((group) => group.filesId).flat();

    const [externalInfo, specialInfo] = await Promise.all([
      await this.pullExternalInfo(
        usersId,
        filesId,
        user,
        new Date(pullSyncDto.baseSyncDate),
      ),
      await this.pullSpecialInfo(user, new Date(pullSyncDto.baseSyncDate)),
    ]);

    return {
      ...syncInfoFlattened,
      special: { ...externalInfo, ...specialInfo },
    };
  }
}
