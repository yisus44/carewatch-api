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
import { PaginateGroupDto } from 'src/user-groups/dto/paginate-group.dto';
import { Permission } from 'src/user-groups/enums/permission.enum';
import { Permissions } from 'src/user-groups/decorators/permission.decorator';
@UseGuards(AuthGuard)
@Controller('medicines')
export class MedicinesController {
  constructor(private readonly medicinesService: MedicinesService) {}
  @Permissions(Permission.writePermissionMedicine)
  @Post()
  create(@Body() createMedicineDto: CreateMedicineDto) {
    return this.medicinesService.create(createMedicineDto);
  }

  @Permissions(Permission.readPermissionMedicine)
  @Get()
  findAll(@Query() paginateGroupDto: PaginateGroupDto) {
    return this.medicinesService.findPaginated(paginateGroupDto, {
      groupId: paginateGroupDto.groupId,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medicinesService.findOneById(+id);
  }

  @Permissions(Permission.writePermissionMedicine)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMedicineDto: UpdateMedicineDto,
  ) {
    return this.medicinesService.update(+id, updateMedicineDto);
  }

  @Permissions(Permission.writePermissionMedicine)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medicinesService.remove(+id);
  }
}
