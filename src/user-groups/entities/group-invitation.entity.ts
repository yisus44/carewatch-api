import { CoreEntity } from 'src/core/entities/core-entity';
import { Group } from 'src/groups/entities/group.entity';
import { Schedule } from 'src/schedules/entities/schedule.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
@Entity()
export class UserGroup extends CoreEntity {
  @ManyToOne(() => User, (user: User) => user.userGroup, {
    eager: true,
    nullable: true,
  })
  user: User;

  @ManyToOne(() => Group, (group: Group) => group.userGroups, {
    onDelete: 'CASCADE',
  })
  group: Group;

  @OneToMany(() => Schedule, (Schedule: Schedule) => Schedule.userGroup, {
    onDelete: 'CASCADE',
  })
  schedules: Schedule;

  @Column()
  groupId: number;

  @Column({ nullable: true })
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
  uploadPermissionFile: boolean;

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

  @Column({ default: false })
  isActive: boolean;
}
