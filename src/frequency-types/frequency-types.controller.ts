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
  UseGuards,
} from '@nestjs/common';
import { FrequencyTypesService } from './frequency-types.service';
import { CreateFrequencyTypeDto } from './dto/create-frequency-type.dto';
import { UpdateFrequencyTypeDto } from './dto/update-frequency-type.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('frequency-types')
export class FrequencyTypesController {
  constructor(private readonly frequencyTypesService: FrequencyTypesService) {}

  @Post()
  create(@Body() createFrequencyTypeDto: CreateFrequencyTypeDto) {
    return this.frequencyTypesService.create(createFrequencyTypeDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.frequencyTypesService.findPaginated(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.frequencyTypesService.findOneById(+id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFrequencyTypeDto: UpdateFrequencyTypeDto,
  ) {
    return this.frequencyTypesService.update(+id, updateFrequencyTypeDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.frequencyTypesService.remove(+id);
  }
}
