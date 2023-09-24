import { CoreEntity } from 'src/core/entities/core-entity';
import { ReminderActivationTime } from 'src/reminder-activation-time/entities/reminder-activation-time.entity';
import { Column, Entity, OneToMany } from 'typeorm';
@Entity()
export class FrequencyType extends CoreEntity {
  @Column()
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
