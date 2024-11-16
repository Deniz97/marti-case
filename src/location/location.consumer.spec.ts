import { LocationConsumer } from './location.consumer';
import { LocationSample, LocationService } from './location.service';
import { AreaService } from '../area/area.service';
import { LogService } from '../logs/log.service';
import { Job } from 'bullmq';
import { Location } from './location.entity';

describe('LocationConsumer', () => {
  let locationConsumer: LocationConsumer;
  let locationService: LocationService;
  let areaService: AreaService;
  let logService: LogService;
  const locationSample = {
    userId: 1,
    lat: 1,
    long: 2,
  };
  const location: Location = {
    id: 1,
    userId: 1,
    point: {
      type: 'Point',
      coordinates: [1, 2],
    },
    createdAt: undefined,
    processed: false,
  };

  beforeEach(() => {
    locationService = new LocationService(null);
    areaService = new AreaService(null);
    logService = new LogService(null);
    locationConsumer = new LocationConsumer(
      locationService,
      areaService,
      logService,
    );
  });

  describe('process', () => {
    it('should process the location sample', async () => {
      jest
        .spyOn(locationService, 'createLocationFromSample')
        .mockImplementation(() => Promise.resolve(location));
      jest
        .spyOn(areaService, 'isPointInAreas')
        .mockImplementation(() => Promise.resolve([]));
      jest
        .spyOn(logService, 'logUserInAreas')
        .mockImplementation(() => Promise.resolve());
      jest
        .spyOn(logService, 'logUserOutOfAreas')
        .mockImplementation(() => Promise.resolve());
      jest
        .spyOn(locationService, 'markSampleProcessed')
        .mockImplementation(() => Promise.resolve());
      const job = {
        data: locationSample,
      } as unknown as Job<LocationSample, any, string>;
      await locationConsumer.process(job);
      expect(locationService.createLocationFromSample).toHaveBeenCalledWith(
        locationSample,
      );
      expect(areaService.isPointInAreas).toHaveBeenCalledWith(
        locationSample.lat,
        locationSample.long,
      );
      expect(logService.logUserInAreas).toHaveBeenCalledWith(
        locationSample.userId,
        [],
      );
      expect(logService.logUserOutOfAreas).toHaveBeenCalledWith(
        locationSample.userId,
        [],
      );
      expect(locationService.markSampleProcessed).toHaveBeenCalledWith(1);
    });
  });
});
