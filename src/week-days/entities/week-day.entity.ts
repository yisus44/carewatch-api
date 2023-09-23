import { CoreEntity } from '../../core/entities/core-entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class WeekDay extends CoreEntity {
  @Column()
  name: string;
}
