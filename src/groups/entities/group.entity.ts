import { CoreEntity } from 'src/core/entities/core-entity';
import { GroupFile } from 'src/group-files/entities/group-file.entity';
import { GroupInvitation } from 'src/group-invitations/entities/group-invitation.entity';
import { Medicine } from 'src/medicines/entities/medicine.entity';
import { Reminder } from 'src/reminders/entities/reminder.entity';
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
    () => GroupInvitation,
    (groupInvitation: GroupInvitation) => groupInvitation.group,
    { onDelete: 'CASCADE' },
  )
  groupInvitations: GroupInvitation;

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
