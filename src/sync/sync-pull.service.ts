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
import { PullSyncDto } from './dto/sync-group.dto';

@Injectable()
export class SyncPullService {
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
  async toReturn(pullullSyncDto: PullSyncDto, user: User) {}
}
