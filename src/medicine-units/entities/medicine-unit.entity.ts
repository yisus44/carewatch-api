import { CoreEntity } from 'src/core/entities/core-entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class MedicineUnit extends CoreEntity {
  @Column()
  name: string;

  @Column()
  description: string;
}
