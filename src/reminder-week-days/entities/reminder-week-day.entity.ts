import { CoreEntity } from 'src/core/entities/core-entity';
import { WeekDay } from 'src/week-days/entities/week-day.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class ReminderWeekDay extends CoreEntity {
  @ManyToOne(() => WeekDay, (weekDay: WeekDay) => weekDay.reminderWeekDay, {})
  weekDay: WeekDay;

  @Column()
  weekDayId: number;

  @Column({
    type: 'time',
  })
  time: string;
}
