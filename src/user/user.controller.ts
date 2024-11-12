import { Controller, Get, Post, Body } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Controller('users')
export class UserController {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  @Post()
  create(@Body() userData: Partial<User>): Promise<User> {
    return this.userRepository.save(userData);
  }
}
