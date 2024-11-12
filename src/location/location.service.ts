import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './location.entity';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

export type LocationSample = { lat: number; long: number; userId: number };

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
  ) {}

  async createLocationFromSample(sample: LocationSample): Promise<Location> {
    const location = new Location();
    location.point = {
      type: 'Point',
      coordinates: [sample.long, sample.lat],
    };
    location.userId = sample.userId;
    return this.locationRepository.save(location);
  }

  async markSampleProcessed(locationId: number): Promise<void> {
    const location = await this.locationRepository.findOne({
      where: { id: locationId },
    });
    location.processed = true;
    await this.locationRepository.save(location);
  }
}
