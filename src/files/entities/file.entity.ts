import { CoreEntity } from 'src/core/entities/core-entity';
import { FileType } from 'src/file-type/entities/file-type.entity';
import { GroupFile } from 'src/group-files/entities/group-file.entity';
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
export class File extends CoreEntity {
  @Column({ length: 50 })
  key: string;

  @Column({ length: 300 })
  location: string;

  @Column({ length: 50 })
  localLocation: string;

  @Column()
  fileTypeId: number;

  @ManyToOne(() => FileType, (fileType: FileType) => fileType.files, {
    eager: true,
  })
  fileType: FileType;

  @OneToMany(() => GroupFile, (groupFile: GroupFile) => groupFile.file, {
    onDelete: 'CASCADE',
  })
  groupFiles: GroupFile;
}
