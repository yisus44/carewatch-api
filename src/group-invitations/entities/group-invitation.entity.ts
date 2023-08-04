import { CoreEntity } from 'src/core/entities/core-entity';
import { Group } from 'src/groups/entities/group.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
@Entity()
export class GroupInvitation extends CoreEntity {
  @ManyToOne(() => User, (user: User) => user.groupInvitation, {
    eager: true,
  })
  user: User;

  @ManyToOne(() => Group, (group: Group) => group.groupInvitations, {
    eager: true,
  })
  group: Group;

  @Column()
  groupId: number;

  @Column()
  userId: number;

  @Column({ default: false })
  readPermissionReminder: boolean;

  @Column({ default: false })
  writePermissionReminder: boolean;

  @Column({ default: false })
  editPermissionReminder: boolean;

  @Column({ default: false })
  deletePermissionReminder: boolean;

  @Column({ default: false })
  readPermissionFile: boolean;

  @Column({ default: false })
  uploadPermissionFIle: boolean;

  @Column({ default: false })
  deletePermissionFile: boolean;

  @Column({ default: false })
  readPermissionMedicine: boolean;

  @Column({ default: false })
  writePermissionMedicine: boolean;

  @Column({ default: false })
  emailCommunication: boolean;

  @Column({ default: false })
  whatsAppCommunication: boolean;

  @Column({ default: false })
  carewatchCommunication: boolean;

  @Column({ nullable: true })
  guestName: string;

  @Column({ nullable: true })
  guestEmail: string;

  @Column({ nullable: true })
  guestPhone: string;

  @Column({ nullable: true })
  token: string;
  @Column({ default: false })
  isAdmin: boolean;
}
