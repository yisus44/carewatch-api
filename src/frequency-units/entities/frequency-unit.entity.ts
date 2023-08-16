import { CoreEntity } from 'src/core/entities/core-entity';
import { ReminderFrequency } from 'src/reminder-frequencies/entities/reminder-frequency.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class FrequencyUnit extends CoreEntity {
  @Column()
  name: string;
  @OneToMany(
    () => ReminderFrequency,
    (reminderFrequencyUnit: ReminderFrequency) =>
      reminderFrequencyUnit.frequencyUnit,
    {
      onDelete: 'CASCADE',
    },
  )
  reminderFrequencyUnit: ReminderFrequency;
}
