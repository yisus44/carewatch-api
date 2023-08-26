import { CoreEntity } from '../../core/entities/core-entity';
import { Group } from '../../groups/entities/group.entity';
import { Medicine } from '../../medicines/entities/medicine.entity';
import { ReminderActivationTime } from '../../reminder-activation-time/entities/reminder-activation-time.entity';
import { ReminderFile } from '../../reminder-files/entities/reminder-file.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Reminder extends CoreEntity {
  @ManyToOne(() => Group, (group: Group) => group.reminders, {
    onDelete: 'CASCADE',
  })
  group: Group;

  @Column()
  groupId: number;

  @ManyToOne(() => Medicine, (medicine: Medicine) => medicine.reminders, {})
  medicine: Medicine;

  @Column()
  medicineId: number;

  @OneToMany(
    () => ReminderFile,
    (reminderFile: ReminderFile) => reminderFile.reminder,
    {
      onDelete: 'CASCADE',
    },
  )
  reminderFiles: ReminderFile;

  @OneToMany(
    () => ReminderActivationTime,
    (reminderActivationTime: ReminderActivationTime) =>
      reminderActivationTime.reminder,
    {
      onDelete: 'CASCADE',
    },
  )
  remindersActivationTime: ReminderActivationTime;

  @Column()
  name: string;

  @Column()
  dosis: number;

  @Column()
  enableBasic: boolean;

  @Column()
  enableCustom: boolean;

  @Column()
  enableVoiceAssistant: boolean;

  @Column()
  enableSmartwatch: boolean;

  @Column({ nullable: true })
  additionalDetails: string;
}
