import { CoreEntity } from '../../core/entities/core-entity';
import { Subscription } from '../../subscriptions/entities/subscription.entity';

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class SubscriptionsHistory extends CoreEntity {
  @OneToMany(
    () => Subscription,
    (subscription: Subscription) => subscription.subscriptionHistory,
    { onDelete: 'CASCADE' },
  )
  subscription: Subscription;

  @Column()
  subscriptionId: number;

  @Column({ length: 50 })
  stripePaymentId: string;

  @Column({ type: 'json' })
  stripePaymentObject: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;
}
