import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { SmartwatchService } from './smartwatch.service';
import { CreateSmartwatchDto } from './dto/create-smartwatch.dto';
import { UpdateSmartwatchDto } from './dto/update-smartwatch.dto';

@Controller('smartwatch')
export class SmartwatchController {
  constructor(private readonly smartwatchService: SmartwatchService) {}

  @Post()
  create(@Body() createSmartwatchDto: CreateSmartwatchDto) {
    return this.smartwatchService.create(createSmartwatchDto);
  }

  @Get()
  findAll() {
    return this.smartwatchService.findPaginated();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.smartwatchService.findOneById(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSmartwatchDto: UpdateSmartwatchDto,
  ) {
    return this.smartwatchService.update(id, updateSmartwatchDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.smartwatchService.remove(id);
  }
}
