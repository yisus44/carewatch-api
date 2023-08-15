import { CoreEntity } from 'src/core/entities/core-entity';
import { Group } from 'src/groups/entities/group.entity';
import { Medicine } from 'src/medicines/entities/medicine.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Reminder extends CoreEntity {
  @ManyToOne(() => Group, (group: Group) => group.reminders, {})
  group: Group;

  @Column()
  groupId: number;

  @ManyToOne(() => Medicine, (medicine: Medicine) => medicine.reminders, {})
  medicine: Medicine;

  @Column()
  medicineId: number;

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