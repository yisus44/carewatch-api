import { CoreEntity } from 'src/core/entities/core-entity';
import { Group } from 'src/groups/entities/group.entity';
import { Medicine } from 'src/medicines/entities/medicine.entity';
import { ReminderFile } from 'src/reminder-files/entities/reminder-file.entity';
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
