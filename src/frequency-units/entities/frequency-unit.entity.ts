import { CoreEntity } from 'src/core/entities/core-entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class FrequencyUnit extends CoreEntity {
  @Column()
  name: string;
}
