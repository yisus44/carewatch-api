import { CoreEntity } from 'src/core/entities/core-entity';
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
export class UserSetting extends CoreEntity {
  @Column()
  userId: number;

  @Column({ length: 50 })
  key: string;

  @Column({ length: 50 })
  value: string;

  @ManyToOne(() => User, (user: User) => user.userSetting, {
    eager: true,
  })
  user: User;
}
