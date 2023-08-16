import { CoreEntity } from 'src/core/entities/core-entity';
import { ReminderWeekDay } from 'src/reminder-week-days/entities/reminder-week-day.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class WeekDay extends CoreEntity {
  @Column()
  name: string;

  @OneToMany(
    () => ReminderWeekDay,
    (reminderWeekDay: ReminderWeekDay) => reminderWeekDay.weekDay,
  )
  reminderWeekDay: ReminderWeekDay;
}
