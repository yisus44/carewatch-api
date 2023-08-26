import { CoreEntity } from '../../core/entities/core-entity';
import { GroupFile } from '../../group-files/entities/group-file.entity';
import { UserGroup } from '../../user-groups/entities/group-invitation.entity';
import { Medicine } from '../../medicines/entities/medicine.entity';
import { Reminder } from '../../reminders/entities/reminder.entity';
import { Column, Entity, OneToMany } from 'typeorm';
@Entity()
export class Group extends CoreEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  patientName: string;

  @OneToMany(
    () => UserGroup,
    (groupInvitation: UserGroup) => groupInvitation.group,
    { onDelete: 'CASCADE' },
  )
  userGroups: UserGroup;

  @OneToMany(() => Medicine, (medicine: Medicine) => medicine.group, {
    onDelete: 'CASCADE',
  })
  medicines: Medicine;

  @OneToMany(() => Reminder, (reminder: Reminder) => reminder.group, {
    onDelete: 'CASCADE',
  })
  reminders: Reminder;

  @OneToMany(() => GroupFile, (groupFile: GroupFile) => groupFile.group, {
    onDelete: 'CASCADE',
  })
  groupFiles: GroupFile;
}
