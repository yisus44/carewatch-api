import { CoreEntity } from '../../core/entities/core-entity';
import { UserGroup } from '../../user-groups/entities/group-invitation.entity';
import { Subscription } from '../../subscriptions/entities/subscription.entity';
import { UserSetting } from '../../user-settings/entities/user-setting.entity';
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

  @OneToMany(
    () => UserSetting,
    (userSetting: UserSetting) => userSetting.user,
    { onDelete: 'CASCADE' },
  )
  userSetting: UserSetting;

  @OneToMany(() => UserGroup, (userGroup: UserGroup) => userGroup.user, {
    onDelete: 'CASCADE',
  })
  userGroup: UserGroup;

  @OneToOne(
    () => Subscription,
    (subscription: Subscription) => subscription.user,
    { onDelete: 'CASCADE' },
  )
  subscription: Subscription;

  //Virtual fields calculated on runtime
  isPremium: boolean;

  hasPaymentMethod: boolean;
}
