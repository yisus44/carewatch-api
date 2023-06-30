import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AwsSesService } from './aws-ses.service';

@Controller('aws-ses')
export class AwsSesController {
  constructor(private readonly awsSesService: AwsSesService) {}

  @Get()
  findAll() {
    return this.awsSesService.generateAuthTemplate();
  }
}
