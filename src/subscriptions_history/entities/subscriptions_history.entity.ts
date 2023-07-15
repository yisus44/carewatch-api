import { Subscription } from 'src/subscriptions/entities/subscription.entity';

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class SubscriptionsHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
