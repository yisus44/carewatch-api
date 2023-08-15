import { CoreEntity } from 'src/core/entities/core-entity';
import { Group } from 'src/groups/entities/group.entity';
import { MedicineUnit } from 'src/medicine-units/entities/medicine-unit.entity';
import { Reminder } from 'src/reminders/entities/reminder.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Medicine extends CoreEntity {
  @ManyToOne(
    () => MedicineUnit,
    (medicineUnit: MedicineUnit) => medicineUnit.medicines,
    {
      eager: true,
    },
  )
  medicineUnit: MedicineUnit;

  @Column()
  medicineUnitId: number;

  @ManyToOne(() => Group, (group: Group) => group.medicines)
  group: Group;

  @OneToMany(() => Reminder, (reminder: Reminder) => reminder.group, {
    onDelete: 'CASCADE',
  })
  reminders: Reminder;

  @Column()
  groupId: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  quantity: string;

  @Column()
  currentQuantity: number;

  @Column()
  lowMedicineThreshold: number;
}
