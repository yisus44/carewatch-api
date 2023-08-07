import { Module } from '@nestjs/common';
import { AwsService } from './aws.service';
import { AssetsModule } from 'src/assets/assets.module';

@Module({
  providers: [AwsService],
  exports: [AwsService],
  imports: [AssetsModule],
})
export class AwsModule {}
