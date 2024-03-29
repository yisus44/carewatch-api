import { CoreEntity } from '../../core/entities/core-entity';
import { UserGroup } from '../../user-groups/entities/group-invitation.entity';
import { Column, Entity, OneToMany } from 'typeorm';
@Entity()
export class Schedule extends CoreEntity {
  @OneToMany(() => UserGroup, (userGroup: UserGroup) => userGroup)
  userGroup: UserGroup;

  @Column()
  userGroupId: number;

  @Column()
  weekDayId: number;

  @Column()
  startTime: string;

  @Column()
  endTime: string;
  @Column({ nullable: false, default: 'America/Mexico_City' })
  timeZone?: string;
  @Column()
  description: string;
}
