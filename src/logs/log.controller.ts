import { Controller, Get } from '@nestjs/common';
import { User } from '../user/user.entity';
import { LogService } from './log.service';
import { Log } from './log.entity';

@Controller('logs')
export class LogController {
  constructor(private logService: LogService) {}

  @Get()
  findAll(): Promise<Log[]> {
    return this.logService.findAllLogs();
  }
}
