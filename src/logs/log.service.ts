import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
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

  async logUserInArea(userId: number, areaId: number): Promise<void> {
    const lastLogForUserAndArea = await this.logRepository.findOne({
      where: { userId, areaId, leftTime: IsNull() },
      order: { entryTime: 'DESC' },
    });

    if (!lastLogForUserAndArea || lastLogForUserAndArea.leftTime) {
      await this.logRepository.save({
        userId,
        areaId,
        entryTime: new Date(),
      });
    }
  }

  async logUserOutOfArea(userId: number, areaId: number): Promise<void> {
    const lastLogForUserAndArea = await this.logRepository.findOne({
      where: { userId, areaId, leftTime: IsNull() },
      order: { entryTime: 'DESC' },
    });

    if (!lastLogForUserAndArea) {
      return;
    }
    lastLogForUserAndArea.leftTime = new Date();
    await this.logRepository.save(lastLogForUserAndArea);
  }
}
