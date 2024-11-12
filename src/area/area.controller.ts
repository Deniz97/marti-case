import { Controller, Get, Post, Body } from '@nestjs/common';
import { Area } from './area.entity';
import { AreaService } from './area.service';

@Controller('areas')
export class AreaController {
  constructor(private areaService: AreaService) {}

  @Get()
  getAreas(): Promise<Area[]> {
    return this.areaService.getAllAreas();
  }

  @Post()
  createArea(
    @Body() areaData: { points: [lat: number, long: number][] },
  ): Promise<Area> {
    return this.areaService.createArea(areaData.points);
  }
}
