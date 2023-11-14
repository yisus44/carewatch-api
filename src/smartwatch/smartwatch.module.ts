import { Module } from '@nestjs/common';
import { SmartwatchService } from './smartwatch.service';
import { SmartwatchController } from './smartwatch.controller';
import { Smartwatch } from './entities/smartwatch.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [SmartwatchController],
  providers: [SmartwatchService],
  imports: [TypeOrmModule.forFeature([Smartwatch])],
})
export class SmartwatchModule {}
