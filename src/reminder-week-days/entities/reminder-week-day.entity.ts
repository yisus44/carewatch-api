import { CoreEntity } from '../../core/entities/core-entity';
import { ReminderActivationTime } from '../../reminder-activation-time/entities/reminder-activation-time.entity';
import { WeekDay } from '../../week-days/entities/week-day.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class ReminderWeekDay extends CoreEntity {
  @ManyToOne(() => WeekDay, (weekDay: WeekDay) => weekDay.reminderWeekDay, {})
  weekDay: WeekDay;

  @Column()
  weekDayId: number;

  @OneToMany(
    () => ReminderActivationTime,
    (reminderActivationTime: ReminderActivationTime) =>
      reminderActivationTime.reminderWeekDay,
    {
      onDelete: 'CASCADE',
    },
  )
  reminderActivationTime: ReminderActivationTime;

  @Column({
    type: 'time',
  })
  time: string;
}
