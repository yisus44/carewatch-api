import { Test, TestingModule } from '@nestjs/testing';
import { GroupInvitationsService } from '../group-invitations.service';

describe('GroupInvitationsService', () => {
  let service: GroupInvitationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupInvitationsService],
    }).compile();

    service = module.get<GroupInvitationsService>(GroupInvitationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
