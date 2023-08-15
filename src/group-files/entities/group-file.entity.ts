import { CoreEntity } from 'src/core/entities/core-entity';
import { Group } from 'src/groups/entities/group.entity';
import { Reminder } from 'src/reminders/entities/reminder.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class GroupFile extends CoreEntity {
  @Column()
  groupId: number;

  @ManyToOne(() => Group, (group: Group) => group.medicines)
  group: Group;

  @ManyToOne(() => Reminder, (reminder: Reminder) => reminder.group, {
    onDelete: 'CASCADE',
  })
  file: Reminder;

  @Column()
  fileId: number;
}
