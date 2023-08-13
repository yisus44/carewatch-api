import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { MedicineUnitsService } from './medicine-units.service';
import { CreateMedicineUnitDto } from './dto/create-medicine-unit.dto';
import { UpdateMedicineUnitDto } from './dto/update-medicine-unit.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('medicine-units')
export class MedicineUnitsController {
  constructor(private readonly medicineUnitsService: MedicineUnitsService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createMedicineUnitDto: CreateMedicineUnitDto) {
    return this.medicineUnitsService.create(createMedicineUnitDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.medicineUnitsService.findPaginated(paginationDto);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medicineUnitsService.findOneById(+id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMedicineUnitDto: UpdateMedicineUnitDto,
  ) {
    return this.medicineUnitsService.update(+id, updateMedicineUnitDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medicineUnitsService.remove(+id);
  }
}
