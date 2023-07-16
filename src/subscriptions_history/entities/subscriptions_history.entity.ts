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
export class SubscriptionsHistory {
  @PrimaryGeneratedColumn()
  id: number;

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
