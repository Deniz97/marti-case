import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { Geometry, Point } from 'geojson';

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column('geometry', { spatialFeatureType: 'Point', srid: 4326 })
  point: Point;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: false })
  processed: boolean;
}
