import { Test, TestingModule } from '@nestjs/testing';
import { GroupInvitationsController } from '../group-invitations.controller';

describe('GroupInvitationsController', () => {
  let controller: GroupInvitationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupInvitationsController],
    }).compile();

    controller = module.get<GroupInvitationsController>(
      GroupInvitationsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
