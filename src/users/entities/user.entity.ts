import { CoreEntity } from 'src/core/entities/core-entity';
import { GroupInvitation } from 'src/group-invitations/entities/group-invitation.entity';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';
import { UserSetting } from 'src/user-settings/entities/user-setting.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User extends CoreEntity {
  @Column({ nullable: true })
  profilePictureId?: number;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 50 })
  lastName: string;

  @Column({ unique: true, length: 50 })
  email: string;

  @Column({ length: 100 })
  password: string;

  @Column({ default: false, length: 15 })
  phone: string;

  @Column({ default: false })
  isActive: boolean;

  @OneToMany(() => UserSetting, (userSetting: UserSetting) => userSetting.user)
  userSetting: UserSetting;

  @OneToMany(
    () => GroupInvitation,
    (groupInvitation: GroupInvitation) => groupInvitation.user,
  )
  groupInvitation: GroupInvitation;

  @OneToOne(
    () => Subscription,
    (subscription: Subscription) => subscription.user,
  )
  subscription: Subscription;

  //Virtual field calculated on runtime
  isPremium: boolean;
}
