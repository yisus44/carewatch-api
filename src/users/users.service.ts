import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { PostgresErrorCode } from 'src/database/postgresErrorCodes.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: number): Promise<User | null> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException();
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.usersRepository.findOneBy({ email });
    if (!user) throw new NotFoundException();
    return user;
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.usersRepository.delete(id);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.update({ id }, updateUserDto);
    return user;
  }
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = this.usersRepository.create({
        ...createUserDto,
        isActive: false,
      });
      return await this.usersRepository.save(user);
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        //TODO: add validation for id not in database
        throw new BadRequestException('Email already in user');
      }
      throw error;
    }
  }
}
