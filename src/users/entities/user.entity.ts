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
export class User {
  @PrimaryGeneratedColumn()
  id: number;

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
    () => Subscription,
    (subscription: Subscription) => subscription.user,
  )
  subscription: Subscription;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
