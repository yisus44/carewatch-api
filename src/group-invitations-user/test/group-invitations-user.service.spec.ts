import { Test, TestingModule } from '@nestjs/testing';
import { GroupInvitationsUserService } from '../group-invitations-user.service';

describe('GroupInvitationsUserService', () => {
  let service: GroupInvitationsUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupInvitationsUserService],
    }).compile();

    service = module.get<GroupInvitationsUserService>(
      GroupInvitationsUserService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
