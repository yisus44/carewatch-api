import { CoreEntity } from 'src/core/entities/core-entity';
import { Reminder } from 'src/reminders/entities/reminder.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class ReminderTime extends CoreEntity {
  @ManyToOne(() => Reminder, (reminder: Reminder) => reminder.reminderFiles, {
    onDelete: 'CASCADE',
  })
  reminder: Reminder;

  @Column()
  reminderId: number;

  @Column({ nullable: true, type: 'time' })
  atTime?: string;

  @Column({ nullable: true })
  eachHours?: string;

  @Column({ nullable: true })
  atWeekdays?: string;

  @Column({ nullable: true })
  eachDays?: number;

  @Column()
  initialDateTime: Date;
}
