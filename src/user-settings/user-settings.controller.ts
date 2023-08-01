import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserSettingsService } from './user-settings.service';
import { CreateUserSettingDto } from './dto/create-user-setting.dto';
import { UpdateUserSettingDto } from './dto/update-user-setting.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { User } from 'src/users/entities/user.entity';
import { GetCurrentUser } from 'src/auth/decorators/current-user';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('user-settings')
export class UserSettingsController {
  constructor(private readonly userSettingsService: UserSettingsService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(
    @Body() createUserSettingDto: CreateUserSettingDto,
    @GetCurrentUser() currentUser: User,
  ) {
    console.log({ currentUser });
    return this.userSettingsService.create({
      ...createUserSettingDto,
      userId: currentUser.id,
    });
  }

  @Get()
  findAll(
    @Query() paginationDto: PaginationDto,
    @GetCurrentUser() currentUser: User,
  ) {
    return this.userSettingsService.findAll(paginationDto, currentUser);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userSettingsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserSettingDto: UpdateUserSettingDto,
  ) {
    return this.userSettingsService.update(+id, updateUserSettingDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userSettingsService.remove(+id);
  }
}
