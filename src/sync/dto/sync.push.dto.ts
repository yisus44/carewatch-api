import { IsNotEmpty } from 'class-validator';
import { File } from 'src/files/entities/file.entity';
import { GroupFile } from 'src/group-files/entities/group-file.entity';
import { Group } from 'src/groups/entities/group.entity';
import { Medicine } from 'src/medicines/entities/medicine.entity';
import { ReminderActivationTime } from 'src/reminder-activation-time/entities/reminder-activation-time.entity';
import { ReminderTime } from 'src/reminder-time/entities/reminder-time.entity';
import { Reminder } from 'src/reminders/entities/reminder.entity';
import { Schedule } from 'src/schedules/entities/schedule.entity';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';
import { SubscriptionsHistory } from 'src/subscriptions_history/entities/subscriptions_history.entity';
import { UserGroup } from 'src/user-groups/entities/group-invitation.entity';
import { UserSetting } from 'src/user-settings/entities/user-setting.entity';
import { User } from 'src/users/entities/user.entity';

export class SyncPushPayload {
  userSettings: UserSetting[];
  subscriptions: Subscription[];
  userGroups: UserGroup[];
  schedules: Schedule[];
  reminders: Reminder[];
  groupFiles: GroupFile[];
  medicines: Medicine[];
  reminderTimes: ReminderTime[];
  subscriptionHistory: SubscriptionsHistory[];
  files: File[];
  users: User[];
  constructor() {
    this.userSettings = [];
    this.subscriptions = [];
    this.userGroups = [];
    this.schedules = [];
    this.reminders = [];
    this.groupFiles = [];
    this.medicines = [];
    this.reminderTimes = [];
    this.subscriptionHistory = [];
    this.files = [];
    this.users = [];
  }
}

export class SyncPushPayloadUpdate extends SyncPushPayload {
  groups: Group[];

  constructor() {
    super();
    this.groups = [];
  }
}
export class SyncPushDto {
  @IsNotEmpty()
  toCreate: SyncPushPayload;
  @IsNotEmpty()
  toUpdate: SyncPushPayloadUpdate;
}
