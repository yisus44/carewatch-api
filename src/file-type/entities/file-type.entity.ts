import { CoreEntity } from '../../core/entities/core-entity';
import { File } from '../../files/entities/file.entity';
import { Column, CreateDateColumn, Entity, OneToMany } from 'typeorm';

@Entity()
export class FileType extends CoreEntity {
  @Column({ length: 25, unique: true })
  type: string;

  @OneToMany(() => File, (file: File) => file.fileType, { onDelete: 'CASCADE' })
  files: File[];
}
