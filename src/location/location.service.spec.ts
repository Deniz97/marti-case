import { Location } from './location.entity';
import { LocationService } from './location.service';
import { DeepPartial, Repository } from 'typeorm';

describe('LocationService', () => {
  let locationService: LocationService;
  let locationRepository: jest.Mocked<Repository<Location>>;
  const location: Location = {
    id: 1,
    point: {
      type: 'Point',
      coordinates: [1, 2],
    },
    userId: 1,
    createdAt: new Date(),
    processed: false,
  };

  beforeEach(() => {
    locationRepository = {
      save: jest.fn(),
      findOne: jest.fn(),
    } as unknown as jest.Mocked<Repository<Location>>;
    locationService = new LocationService(locationRepository);
  });

  describe('create location from sample', () => {
    it('should return the created location', async () => {
      jest
        .spyOn(locationRepository, 'save')
        .mockImplementation(() => Promise.resolve(location));
      const sample = {
        userId: 1,
        lat: 1,
        long: 2,
      };
      expect(await locationService.createLocationFromSample(sample)).toBe(
        location,
      );
      expect(locationRepository.save).toHaveBeenCalledWith(
        expect.any(Location),
      );
    });
  });

  describe('mark sample processed', () => {
    it('should mark the location as processed', async () => {
      jest
        .spyOn(locationRepository, 'findOne')
        .mockImplementation(() => Promise.resolve(location));
      jest
        .spyOn(locationRepository, 'save')
        .mockImplementation(() => Promise.resolve(location));
      expect(await locationService.markSampleProcessed(1)).toBeUndefined();
      expect(locationRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(locationRepository.save).toHaveBeenCalledWith(location);
    });
  });
});
