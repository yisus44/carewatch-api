import { File } from 'src/files/entities/file.entity';
import { GroupFile } from 'src/group-files/entities/group-file.entity';
import { Group } from 'src/groups/entities/group.entity';
import { Medicine } from 'src/medicines/entities/medicine.entity';
import { ReminderActivationTime } from 'src/reminder-activation-time/entities/reminder-activation-time.entity';
import { Reminder } from 'src/reminders/entities/reminder.entity';
import { Schedule } from 'src/schedules/entities/schedule.entity';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';
import { SubscriptionsHistory } from 'src/subscriptions_history/entities/subscriptions_history.entity';
import { UserGroup } from 'src/user-groups/entities/group-invitation.entity';
import { UserSetting } from 'src/user-settings/entities/user-setting.entity';

export class SyncDto {
  toCreate: SyncPayload;
  toUpdate: SyncPayload;
}

export class SyncPayload {
  userSettings: UserSetting[];
  subscriptions: Subscription[];
  userGroups: UserGroup[];
  groups: Group[];
  schedules: Schedule[];
  reminders: Reminder[];
  groupFiles: GroupFile[];
  medicines: Medicine[];
  reminderActivationTime: ReminderActivationTime[];
  subscriptionHistory: SubscriptionsHistory[];
  files: File[];
  constructor() {
    this.userSettings = [];
    this.subscriptions = [];
    this.userGroups = [];
    this.groups = [];
    this.schedules = [];
    this.reminders = [];
    this.groupFiles = [];
    this.medicines = [];
    this.reminderActivationTime = [];
    this.subscriptionHistory = [];
    this.files = [];
  }
}
