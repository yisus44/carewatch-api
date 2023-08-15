import { CoreEntity } from 'src/core/entities/core-entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class WeekDay extends CoreEntity {
  @Column()
  name: string;
}
