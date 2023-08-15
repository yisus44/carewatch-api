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
import { ReminderFilesService } from './reminder-files.service';
import { CreateReminderFileDto } from './dto/create-reminder-file.dto';
import { UpdateReminderFileDto } from './dto/update-reminder-file.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('reminder-files')
export class ReminderFilesController {
  constructor(private readonly reminderFilesService: ReminderFilesService) {}

  @Post()
  create(@Body() createReminderFileDto: CreateReminderFileDto) {
    return this.reminderFilesService.create(createReminderFileDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.reminderFilesService.findPaginated(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reminderFilesService.findOneById(+id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReminderFileDto: UpdateReminderFileDto,
  ) {
    return this.reminderFilesService.update(+id, updateReminderFileDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.reminderFilesService.remove(+id);
  }
}
