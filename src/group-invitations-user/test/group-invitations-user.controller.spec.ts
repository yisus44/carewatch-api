import { Test, TestingModule } from '@nestjs/testing';
import { GroupInvitationsUserController } from '../group-invitations-user.controller';
import { GroupInvitationsUserService } from '../group-invitations-user.service';

describe('GroupInvitationsUserController', () => {
  let controller: GroupInvitationsUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupInvitationsUserController],
      providers: [GroupInvitationsUserService],
    }).compile();

    controller = module.get<GroupInvitationsUserController>(
      GroupInvitationsUserController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
