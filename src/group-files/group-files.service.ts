import { Injectable } from '@nestjs/common';
import { CreateGroupFileDto } from './dto/create-group-file.dto';
import { UpdateGroupFileDto } from './dto/update-group-file.dto';
import { CoreService } from '../core/core.service';
import { GroupFile } from './entities/group-file.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ResourceAlreadyExist } from 'src/common/exceptions/resource-already-exists.exception';

@Injectable()
export class GroupFilesService extends CoreService<GroupFile> {
  constructor(
    @InjectRepository(GroupFile)
    private readonly groupFileRepository: Repository<GroupFile>,
  ) {
    super(groupFileRepository);
  }
  async batchUpdate(entities: Partial<GroupFile>[]) {
    const promiseArr = [];
    if (!entities) return;
    for (const entity of entities) {
      promiseArr.push(this.update(entity.id, entity));
    }
    await Promise.all(promiseArr);
  }

  async batchCreate(entities: Partial<GroupFile>[]) {
    const promiseArr = [];
    if (!entities) return;
    for (const entity of entities) {
      delete entity.id;
      promiseArr.push(this.create(entity as GroupFile));
    }
    await Promise.all(promiseArr);
  }
  async failIfFileExist(groupId: number, fileId: number) {
    const match = await this.findOneBy({ groupId, fileId });
    if (match) throw new ResourceAlreadyExist();
  }
}
