import { CoreEntity } from '../../core/entities/core-entity';
import { Medicine } from '../../medicines/entities/medicine.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class MedicineUnit extends CoreEntity {
  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @OneToMany(() => Medicine, (medicine: Medicine) => medicine.medicineUnit, {
    onDelete: 'CASCADE',
  })
  medicines: Medicine;
}
