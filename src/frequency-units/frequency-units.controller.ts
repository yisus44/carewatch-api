import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { FrequencyUnitsService } from './frequency-units.service';
import { CreateFrequencyUnitDto } from './dto/create-frequency-unit.dto';
import { UpdateFrequencyUnitDto } from './dto/update-frequency-unit.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('frequency-units')
export class FrequencyUnitsController {
  constructor(private readonly frequencyUnitsService: FrequencyUnitsService) {}

  @Post()
  create(@Body() createFrequencyUnitDto: CreateFrequencyUnitDto) {
    return this.frequencyUnitsService.create(createFrequencyUnitDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.frequencyUnitsService.findPaginated(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.frequencyUnitsService.findOneById(+id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFrequencyUnitDto: UpdateFrequencyUnitDto,
  ) {
    return this.frequencyUnitsService.update(+id, updateFrequencyUnitDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.frequencyUnitsService.remove(+id);
  }
}
