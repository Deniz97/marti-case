import { AreaController } from './area.controller';
import { Area } from './area.entity';
import { AreaService } from './area.service';
import { HttpException } from '@nestjs/common';

describe('AreaController', () => {
  let areaController: AreaController;
  let areaService: AreaService;
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
    areaService = new AreaService(null);
    areaController = new AreaController(areaService);
  });

  describe('get Areas', () => {
    it('should return an array of areas', async () => {
      jest
        .spyOn(areaService, 'getAllAreas')
        .mockImplementation(() => Promise.resolve([area]));

      expect(await areaController.getAreas()).toStrictEqual([area]);
      expect(areaService.getAllAreas).toHaveBeenCalled();
    });
  });

  describe('create Area', () => {
    it('should return a new area', async () => {
      jest
        .spyOn(areaService, 'createArea')
        .mockImplementation(() => Promise.resolve(area));

      expect(
        await areaController.createArea({
          points: [
            [1, 2],
            [3, 4],
            [5, 6],
            [1, 2],
          ],
        }),
      ).toStrictEqual(area);
      expect(areaService.createArea).toHaveBeenCalledWith([
        [1, 2],
        [3, 4],
        [5, 6],
        [1, 2],
      ]);
    });
  });
});
