import { PartialType } from '@nestjs/mapped-types';
import { CreateGroupInvitationDto } from './create-group-invitation.dto';

export class UpdateGroupInvitationDto extends PartialType(CreateGroupInvitationDto) {}
