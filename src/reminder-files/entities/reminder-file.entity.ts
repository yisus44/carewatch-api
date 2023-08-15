import { CoreEntity } from 'src/core/entities/core-entity';
import { File } from 'src/files/entities/file.entity';
import { Reminder } from 'src/reminders/entities/reminder.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class ReminderFile extends CoreEntity {
  @ManyToOne(() => Reminder, (reminder: Reminder) => reminder.reminderFiles, {})
  reminder: Reminder;

  @Column()
  reminderId: number;

  @ManyToOne(() => File, (file: File) => file.reminderFiles, {})
  file: File;

  @Column()
  fileId: number;

  @Column({ default: false })
  isFromCarewatch: boolean;
}
