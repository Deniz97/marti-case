import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Area } from './area.entity';

@Injectable()
export class AreaService {
  constructor(
    @InjectRepository(Area)
    private areaRepository: Repository<Area>,
  ) {}

  async getAllAreas(): Promise<Area[]> {
    return this.areaRepository.find();
  }
  ƒ;
  async createArea(coordinates: number[][]): Promise<Area> {
    const area = new Area();
    area.polygon = {
      type: 'Polygon',
      coordinates: [coordinates],
    };
    return this.areaRepository.save(area);
  }

  async isPointInAreas(
    latitude: number,
    longitude: number,
  ): Promise<{ areaId: number; isInArea: boolean }[]> {
    const results = await this.areaRepository
      .createQueryBuilder('area')
      .select('area.id', 'areaId')
      .addSelect(
        'ST_Contains(area.polygon, ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326))',
        'isInArea',
      )
      .setParameters({
        longitude,
        latitude,
      })
      .getRawMany();
    return results;
  }
}
