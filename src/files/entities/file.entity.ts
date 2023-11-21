import { Medicine } from 'src/medicines/entities/medicine.entity';
import { CoreEntity } from '../../core/entities/core-entity';
import { FileType } from '../../file-type/entities/file-type.entity';
import { GroupFile } from '../../group-files/entities/group-file.entity';
import { ReminderFile } from '../../reminder-files/entities/reminder-file.entity';
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
  @Column({ length: 300 })
  key: string;

  @Column({ length: 300 })
  location: string;

  @Column({ length: 300 })
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

  @OneToMany(
    () => ReminderFile,
    (reminderFile: ReminderFile) => reminderFile.file,
    {
      onDelete: 'CASCADE',
    },
  )
  reminderFiles: ReminderFile;

  @OneToMany(() => Medicine, (medicine: Medicine) => medicine.photo, {
    onDelete: 'CASCADE',
  })
  medicines: Medicine;
}
