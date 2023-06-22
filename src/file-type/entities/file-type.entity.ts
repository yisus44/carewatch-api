import { File } from 'src/files/entities/file.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class FileType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 25, unique: true })
  type: string;

  @OneToMany(() => File, (file: File) => file.fileType)
  files: File[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
