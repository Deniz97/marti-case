import { Area } from './area.entity';
import { AreaService } from './area.service';
import { DeepPartial, Repository } from 'typeorm';

describe('AreaService', () => {
  let areaService: AreaService;
  let areaRepository: Partial<Repository<Area>>;
  const area: Area = {
    id: 1,
    polygon: {
      type: 'Polygon',
      coordinates: [
        [
          [1, 2],
          [3, 4],
          [5, 6],
          [1, 2],
        ],
      ],
    },
    createdAt: new Date(),
    logs: [],
  };
  beforeEach(() => {
    areaRepository = {
      find: jest.fn((_) => Promise.resolve([area])),
      save: jest.fn(
        (entity: DeepPartial<Area>): Promise<Area> => Promise.resolve(area),
      ),
    } as unknown as Partial<Repository<Area>>;
    areaService = new AreaService(areaRepository as Repository<Area>);
  });

  describe('get all areas', () => {
    it('should return an array of areas', async () => {
      jest
        .spyOn(areaRepository, 'find')
        .mockImplementation(() => Promise.resolve([area]));

      expect(await areaService.getAllAreas()).toStrictEqual([area]);
      expect(areaRepository.find).toHaveBeenCalled();
    });
  });

  describe('create area', () => {
    it('should return the created area', async () => {
      jest
        .spyOn(areaRepository, 'save')
        .mockImplementation(() => Promise.resolve(area));
      const coordinates = [
        [1, 2],
        [3, 4],
        [5, 6],
        [1, 2],
      ];
      expect(await areaService.createArea(coordinates)).toStrictEqual(area);
      expect(areaRepository.save).toHaveBeenCalledWith(expect.any(Area));
    });
  });

  describe('is point in areas', () => {
    it('should return an array of objects with areaId and isInArea', async () => {
      const result = [
        {
          areaId: 1,
          isInArea: true,
        },
      ];
      jest
        .spyOn(areaService, 'isPointInAreas')
        .mockImplementation(() => Promise.resolve(result));

      expect(await areaService.isPointInAreas(1, 2)).toBe(result);
    });
  });
});
