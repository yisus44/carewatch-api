import { CoreEntity } from '../../core/entities/core-entity';
import { SubscriptionsHistory } from '../../subscriptions_history/entities/subscriptions_history.entity';
import { User } from '../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Subscription extends CoreEntity {
  @Column({ length: 50 })
  stripeUserId: string;

  @Column({ length: 100, nullable: true })
  stripeSubscriptionId: string;

  @Column()
  userId: number;

  @OneToOne(() => User, (user: User) => user.subscription)
  user: User;

  @OneToMany(
    () => SubscriptionsHistory,
    (SubscriptionsHistory: SubscriptionsHistory) =>
      SubscriptionsHistory.subscription,
    { onDelete: 'CASCADE' },
  )
  subscriptionHistory: [SubscriptionsHistory];

  @Column({ default: 30 })
  frequency: number;

  @Column({ default: false })
  active: boolean;
}
