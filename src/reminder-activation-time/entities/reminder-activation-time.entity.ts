import { CoreEntity } from '../../core/entities/core-entity';
import { ReminderFrequency } from '../../reminder-frequencies/entities/reminder-frequency.entity';
import { ReminderWeekDay } from '../../reminder-week-days/entities/reminder-week-day.entity';
import { Reminder } from '../../reminders/entities/reminder.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class ReminderActivationTime extends CoreEntity {
  @ManyToOne(
    () => Reminder,
    (reminder: Reminder) => reminder.remindersActivationTime,
  )
  reminder: Reminder;

  @Column()
  reminderId: number;

  @ManyToOne(
    () => ReminderWeekDay,
    (reminderWeekDay: ReminderWeekDay) =>
      reminderWeekDay.reminderActivationTime,
  )
  reminderWeekDay: ReminderWeekDay;

  @Column()
  reminderWeekDayId: number;

  @ManyToOne(
    () => ReminderFrequency,
    (reminderFrequency: ReminderFrequency) =>
      reminderFrequency.reminderActivationTime,
  )
  reminderFrequeny: ReminderFrequency;

  @Column()
  reminderFrequencyId: number;
}
