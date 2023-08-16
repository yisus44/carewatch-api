import { CoreEntity } from 'src/core/entities/core-entity';
import { FrequencyUnit } from 'src/frequency-units/entities/frequency-unit.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class ReminderFrequency extends CoreEntity {
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
