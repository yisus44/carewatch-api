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
import { PaginationDto } from '../common/dto/pagination.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
@UseGuards(AuthGuard)
@Controller('medicine-units')
export class MedicineUnitsController {
  constructor(private readonly medicineUnitsService: MedicineUnitsService) {}

  @Post()
  create(@Body() createMedicineUnitDto: CreateMedicineUnitDto) {
    return this.medicineUnitsService.create(createMedicineUnitDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.medicineUnitsService.findPaginated(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medicineUnitsService.findOneById(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMedicineUnitDto: UpdateMedicineUnitDto,
  ) {
    return this.medicineUnitsService.update(+id, updateMedicineUnitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medicineUnitsService.remove(+id);
  }
}
