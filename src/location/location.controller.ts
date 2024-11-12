import { Controller, Post, Body } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { LocationSample } from './location.service';

@Controller('locations')
export class LocationController {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectQueue('location') private locationQueue: Queue,
  ) {}

  @Post()
  async sampleLocation(
    @Body() userLocationSample: LocationSample,
  ): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userLocationSample.userId },
    });
    if (!user) {
      throw new Error('User not found');
    }
    await this.locationQueue.add('sample', userLocationSample);
  }
}
