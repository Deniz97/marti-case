import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Repository } from 'typeorm';
import { Log } from './log.entity';

@Injectable()
export class LogService {
  constructor(
    @InjectRepository(Log)
    private logRepository: Repository<Log>,
  ) {}

  async findAllLogs(): Promise<Log[]> {
    return this.logRepository.find();
  }

  async logUserInAreas(userId: number, areaIds: number[]): Promise<void> {
    const logsForUserAndArea = await this.logRepository.find({
      where: { userId, areaId: In(areaIds), leftTime: IsNull() },
    });

    const newAreaIds = areaIds.filter((areaId) => {
      return !logsForUserAndArea.some((log) => log.areaId === areaId);
    });
    const newAreas = newAreaIds.map((areaId) => ({
      userId,
      areaId,
      entryTime: new Date(),
    }));
    await this.logRepository.save(newAreas);
  }

  async logUserOutOfAreas(userId: number, areaIds: number[]): Promise<void> {
    await this.logRepository.update(
      {
        userId,
        areaId: In(areaIds),
        leftTime: IsNull(),
      },
      {
        leftTime: new Date(),
      },
    );
  }
}
