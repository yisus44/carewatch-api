import { CoreEntity } from 'src/core/entities/core-entity';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';

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
