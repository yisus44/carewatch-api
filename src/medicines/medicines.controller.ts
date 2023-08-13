import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MedicinesService } from './medicines.service';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('medicines')
export class MedicinesController {
  constructor(private readonly medicinesService: MedicinesService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createMedicineDto: CreateMedicineDto) {
    return this.medicinesService.create(createMedicineDto);
  }
  @UseGuards(AuthGuard)
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.medicinesService.findPaginated(paginationDto);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medicinesService.findOneById(+id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMedicineDto: UpdateMedicineDto,
  ) {
    return this.medicinesService.update(+id, updateMedicineDto);
  }
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medicinesService.remove(+id);
  }
}
