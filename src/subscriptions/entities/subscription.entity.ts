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

  @Column({ length: 100, nullable: true })
  stripeSubscriptionId: string;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user: User) => user.userSetting, {
    eager: true,
  })
  user: User;

  @Column({ default: 30 })
  frequency: number;

  @Column({ default: false })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
