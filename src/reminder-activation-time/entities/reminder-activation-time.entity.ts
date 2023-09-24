import { Column, Entity, ManyToOne } from 'typeorm';
import { CoreEntity } from 'src/core/entities/core-entity';
import { FrequencyType } from 'src/frequency-types/entities/frequency-type.entity';
import { Reminder } from 'src/reminders/entities/reminder.entity';

@Entity()
export class ReminderActivationTime extends CoreEntity {
  @ManyToOne(
    () => FrequencyType,
    (frequencyType: FrequencyType) => frequencyType.reminderActivationTime,
  )
  frequencyType: FrequencyType;

  @ManyToOne(
    () => Reminder,
    (reminder: Reminder) => reminder.reminderActivationTime,
  )
  reminder: Reminder;

  @Column()
  frequencyTypeId: number;

  @Column()
  reminderId: number;

  @Column({ nullable: true })
  time?: Date;

  @Column()
  times: number;

  @Column()
  frequencyValue: string;

  @Column({ nullable: true })
  intialDateTime?: Date;
}
