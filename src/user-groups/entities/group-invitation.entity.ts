import { Smartwatch } from 'src/smartwatch/entities/smartwatch.entity';
import { CoreEntity } from '../../core/entities/core-entity';
import { Group } from '../../groups/entities/group.entity';
import { Schedule } from '../../schedules/entities/schedule.entity';
import { User } from '../../users/entities/user.entity';
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
    eager: true,
  })
  group: Group;

  @OneToMany(() => Schedule, (Schedule: Schedule) => Schedule.userGroup, {
    onDelete: 'CASCADE',
  })
  schedules: Schedule;

  @OneToMany(
    () => Smartwatch,
    (smartwatch: Smartwatch) => smartwatch.userGroup,
    {
      onDelete: 'CASCADE',
    },
  )
  smartwatch: Smartwatch;
  @Column()
  groupId: number;

  @Column({ nullable: true })
  userId: number;

  @Column({ default: true })
  readPermissionReminder: boolean;

  @Column({ default: true })
  writePermissionReminder: boolean;

  @Column({ default: true })
  editPermissionReminder: boolean;

  @Column({ default: true })
  deletePermissionReminder: boolean;

  @Column({ default: true })
  readPermissionFile: boolean;

  @Column({ default: true })
  uploadPermissionFile: boolean;

  @Column({ default: true })
  deletePermissionFile: boolean;

  @Column({ default: true })
  readPermissionMedicine: boolean;

  @Column({ default: true })
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
