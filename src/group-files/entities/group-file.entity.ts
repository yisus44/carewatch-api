import { CoreEntity } from '../../core/entities/core-entity';
import { File } from '../../files/entities/file.entity';
import { Group } from '../../groups/entities/group.entity';
import { Reminder } from '../../reminders/entities/reminder.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class GroupFile extends CoreEntity {
  @Column()
  groupId: number;

  @ManyToOne(() => Group, (group: Group) => group.medicines, {
    onDelete: 'CASCADE',
  })
  group: Group;

  @ManyToOne(() => File, (file: File) => file.groupFiles, {
    onDelete: 'CASCADE',
  })
  file: File;

  @Column()
  fileId: number;
}
