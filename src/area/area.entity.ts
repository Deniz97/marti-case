import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Geometry, Polygon } from 'geojson';
import { Log } from 'src/logs/log.entity';

@Entity()
export class Area {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('geometry', { spatialFeatureType: 'Polygon', srid: 4326 })
  polygon: Polygon;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Log, (log) => log.user)
  logs: Log[];
}
