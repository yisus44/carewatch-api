import { File } from 'src/files/entities/file.entity';
import { CoreEntity } from '../../core/entities/core-entity';
import { Group } from '../../groups/entities/group.entity';
import { MedicineUnit } from '../../medicine-units/entities/medicine-unit.entity';
import { Reminder } from '../../reminders/entities/reminder.entity';
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

  @ManyToOne(() => File, (File: File) => File.medicines, {
    eager: true,
  })
  photo: File;

  @Column()
  photoId: number;

  @ManyToOne(() => Group, (group: Group) => group.medicines, {
    onDelete: 'CASCADE',
  })
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
  quantity: number;

  @Column()
  currentQuantity: number;

  @Column()
  lowMedicineThreshold: number;
}
