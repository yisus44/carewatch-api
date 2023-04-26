import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 120 })
  name: string;

  @Column({ length: 100 })
  password: string;

  @Column({ unique: true, length: 50 })
  email: string;

  @Column({ default: false, length: 15 })
  phone: string;

  @Column({ default: false })
  isActive: boolean;
}
