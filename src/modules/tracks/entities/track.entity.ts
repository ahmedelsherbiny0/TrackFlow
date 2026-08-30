import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  VirtualColumn,
} from 'typeorm';
import { TrackMentor } from './track_mentors.entity';
import { TrackRookie } from './track_rookies.entity';
import { Assignment } from '../../assignments/entities/assignment.entity';

import { Type } from 'class-transformer';

@Entity('tracks')
export class Track {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @OneToMany(() => TrackMentor, (trackMentor) => trackMentor.track)
  @Type(() => TrackMentor)
  trackMentors!: TrackMentor[];

  @OneToMany(() => TrackRookie, (trackRookie) => trackRookie.track)
  trackRookies!: TrackRookie[];

  @OneToMany(() => Assignment, (assignment) => assignment.track)
  assignments!: Assignment[];

  @VirtualColumn({
    query: (alias) =>
      `SELECT COUNT(*) FROM track_rookies WHERE track_id = ${alias}.id`,
  })
  rookiesCount?: number;

  @VirtualColumn({
    query: (alias) =>
      `SELECT COUNT(*) FROM assignments WHERE track_id = ${alias}.id`,
  })
  assignmentsCount?: number;
}
