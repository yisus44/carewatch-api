import { CoreEntity } from 'src/core/entities/core-entity';
import { ReminderActivationTime } from 'src/reminder-activation-time/entities/reminder-activation-time.entity';
import { Column, Entity, OneToMany } from 'typeorm';

export enum FrequencyTypeEnum {
  SECOND = 'second',
  MINUTE = 'minute',
  HOUR = 'hour',
  DAY = 'day',
  SPECIFC_WEEKDAY = 'weekday',
  SPECIFC_DATE = 'date',
}
@Entity()
export class FrequencyType extends CoreEntity {
  @Column({ unique: true })
  name: string;

  @Column()
  details: string;

  @Column()
  format: string;

  @OneToMany(
    () => ReminderActivationTime,
    (reminderActivationTime: ReminderActivationTime) =>
      reminderActivationTime.frequencyType,
    { onDelete: 'CASCADE' },
  )
  reminderActivationTime: ReminderActivationTime[];
}
