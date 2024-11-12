import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { UserController } from './user/user.controller';
import { AreaController } from './area/area.controller';
import { LocationService } from './location/location.service';
import { AreaService } from './area/area.service';
import { Area } from './area/area.entity';
import { User } from './user/user.entity';
import { Log } from './logs/log.entity';
import { Location } from './location/location.entity';
import { LogController } from './logs/log.controller';
import { LogService } from './logs/log.service';
import { LocationConsumer } from './location/location.consumer';
import { LocationController } from './location/location.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'marti_case_database',
      entities: [Location, Area, User, Log],
      synchronize: true, // Only for development; do not use in production
    }),
    TypeOrmModule.forFeature([Location, Area, User, Log]),
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'location',
    }),
  ],
  controllers: [
    AppController,
    UserController,
    AreaController,
    LogController,
    LocationController,
  ],
  providers: [
    AppService,
    LocationService,
    AreaService,
    LogService,
    LocationConsumer,
  ],
})
export class AppModule {}
