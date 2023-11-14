import { Column, Entity, ManyToOne } from 'typeorm';
import { CoreEntity } from 'src/core/entities/core-entity';
import { UserGroup } from 'src/user-groups/entities/group-invitation.entity';

@Entity()
export class Smartwatch extends CoreEntity {
  @Column({ length: 250 })
  tokenAccount: string;

  @Column()
  userGroupId: number;

  @ManyToOne(() => UserGroup, (userGroup: UserGroup) => userGroup.smartwatch, {
    eager: true,
  })
  userGroup: UserGroup;

  @Column({ length: 250 })
  smartwatchName: string;

  @Column({ length: 250 })
  smartwatchToken: string;

  @Column()
  isConnected: boolean;
}
