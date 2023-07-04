import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  stripeUserId: string;

  @Column({ length: 50 })
  stripeSubscriptionId: string;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user: User) => user.userSetting, {
    eager: true,
  })
  user: User;

  @Column()
  frequency: number;

  @Column()
  active: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
