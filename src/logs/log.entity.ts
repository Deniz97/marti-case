import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Area } from '../area/area.entity';
import { User } from '../user/user.entity';

@Entity()
export class Log {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => User, user => user.logs)
  @JoinColumn({ name: "userId" })
  user: User;

  @Column()
  areaId: number;

  @ManyToOne(() => Area, area => area.logs)
  @JoinColumn({ name: "areaId" })
  area: Area;

  @Column()
  entryTime: Date;

  @Column({ nullable: true })
  leftTime: Date | null;
}
