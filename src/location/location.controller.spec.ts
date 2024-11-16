import { LocationController } from './location.controller';
import { LocationSample } from './location.service';
import { User } from '../user/user.entity';
import { Queue } from 'bullmq';
import { HttpException } from '@nestjs/common';

describe('LocationController', () => {
  let locationController: LocationController;
  let userRepository: any;
  let locationQueue: any;
  const user: User = {
    id: 1,
    email: 'test@test.com',
    logs: [],
  };
  const locationSample: LocationSample = {
    userId: 1,
    lat: 1,
    long: 2,
  };

  beforeEach(() => {
    userRepository = {
      findOne: jest.fn(),
    };
    locationQueue = {
      add: jest.fn(),
    };
    locationController = new LocationController(userRepository, locationQueue);
  });

  describe('sampleLocation', () => {
    it('should add location sample to queue', async () => {
      userRepository.findOne.mockResolvedValue(user);
      await locationController.sampleLocation(locationSample);
      expect(locationQueue.add).toHaveBeenCalledWith('sample', locationSample);
    });

    it('should throw error if user not found', async () => {
      userRepository.findOne.mockResolvedValue(null);
      await expect(
        locationController.sampleLocation(locationSample),
      ).rejects.toThrow('User not found');
    });
  });
});
