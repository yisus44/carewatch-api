import { IsNotEmpty } from 'class-validator';
import { File } from 'src/files/entities/file.entity';
import { GroupFile } from 'src/group-files/entities/group-file.entity';
import { Group } from 'src/groups/entities/group.entity';
import { Medicine } from 'src/medicines/entities/medicine.entity';
import { ReminderActivationTime } from 'src/reminder-activation-time/entities/reminder-activation-time.entity';
import { ReminderFile } from 'src/reminder-files/entities/reminder-file.entity';
import { ReminderTime } from 'src/reminder-time/entities/reminder-time.entity';
import { Reminder } from 'src/reminders/entities/reminder.entity';
import { Schedule } from 'src/schedules/entities/schedule.entity';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';
import { SubscriptionsHistory } from 'src/subscriptions_history/entities/subscriptions_history.entity';
import { UserGroup } from 'src/user-groups/entities/group-invitation.entity';
import { UserSetting } from 'src/user-settings/entities/user-setting.entity';
import { User } from 'src/users/entities/user.entity';

export class SyncPullPayload {
  userGroups: UserGroup[];
  groups: Group[];
  schedules: Schedule[];
  reminders: Reminder[];
  groupFiles: GroupFile[];
  medicines: Medicine[];
  reminderTimes: ReminderTime[];
  reminderFiles: ReminderFile[];

  constructor() {
    this.userGroups = [];
    this.groups = [];
    this.schedules = [];
    this.reminders = [];
    this.groupFiles = [];
    this.medicines = [];
    this.reminderTimes = [];
    this.reminderFiles = [];
  }
}

export class SyncSpecialDto {
  userSettings: UserSetting[];
  subscriptions: Subscription[];
  subscriptionHistory: SubscriptionsHistory[];
  users: User[];
  files: File[];
}
export class SyncDto {
  @IsNotEmpty()
  toCreate: SyncPullPayload;
  @IsNotEmpty()
  toUpdate: SyncPullPayload;
  @IsNotEmpty()
  special: SyncSpecialDto;
}
