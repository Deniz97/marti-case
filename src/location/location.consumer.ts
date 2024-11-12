import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { LocationSample, LocationService } from './location.service';
import { AreaService } from '../area/area.service';
import { LogService } from '../logs/log.service';

@Processor('location')
export class LocationConsumer extends WorkerHost {
  constructor(
    private locationService: LocationService,
    private areaService: AreaService,
    private logService: LogService,
  ) {
    super();
  }
  async process(job: Job<LocationSample, any, string>): Promise<any> {
    try {
      await this._processLocationSample(job.data);
    } catch (e) {
      console.error('Error processing location sample: ', e);
    }
  }

  async _processLocationSample(data: LocationSample): Promise<void> {
    const created = await this.locationService.createLocationFromSample(data);
    const allAreaResults = await this.areaService.isPointInAreas(
      data.lat,
      data.long,
    );
    const inAreaIds = allAreaResults
      .filter((area) => area.isInArea)
      .map((area) => area.areaId);
    const outAreaIds = allAreaResults
      .filter((area) => !area.isInArea)
      .map((area) => area.areaId);
    const promsIn = inAreaIds.map((areaId) => {
      this.logService.logUserInAreas(data.userId, inAreaIds);
    });
    const promsOut = outAreaIds.map((areaId) => {
      this.logService.logUserOutOfAreas(data.userId, outAreaIds);
    });
    await Promise.all([...promsIn, ...promsOut]);
    await this.locationService.markSampleProcessed(created.id);
  }
}
