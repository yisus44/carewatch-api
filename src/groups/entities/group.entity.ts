import { CoreEntity } from 'src/core/entities/core-entity';
import { GroupInvitation } from 'src/group-invitations/entities/group-invitation.entity';
import { Medicine } from 'src/medicines/entities/medicine.entity';
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
}
