import { Injectable } from '@nestjs/common';
import { SyncDto } from './dto/sync.dto';

@Injectable()
export class SyncService {
  toReturn(date: string) {}
  SyncDto(SyncDto: SyncDto) {}
}
