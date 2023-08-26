import { CoreEntity } from '../../core/entities/core-entity';
import { FrequencyUnit } from '../../frequency-units/entities/frequency-unit.entity';
import { ReminderActivationTime } from '../../reminder-activation-time/entities/reminder-activation-time.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class ReminderFrequency extends CoreEntity {
  @OneToMany(
    () => ReminderActivationTime,
    (reminderActivationTime: ReminderActivationTime) =>
      reminderActivationTime.reminderWeekDay,
    {
      onDelete: 'CASCADE',
    },
  )
  reminderActivationTime: ReminderActivationTime;

  @ManyToOne(
    () => FrequencyUnit,
    (frequencyUnit: FrequencyUnit) => frequencyUnit.reminderFrequencyUnit,
  )
  frequencyUnit: FrequencyUnit;

  @Column()
  frequencyUnitId: number;

  @Column()
  defaultInitDatetime: string;

  @Column({ type: 'smallint' })
  times: number;
}
