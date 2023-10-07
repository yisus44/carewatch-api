import { CoreEntity } from '../../core/entities/core-entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class WeekDay extends CoreEntity {
  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  weekDayNumber: number;
}
