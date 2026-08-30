import {
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Track } from './track.entity';

import { Exclude } from 'class-transformer';

@Entity('track_mentors')
export class TrackMentor {
  @Exclude()
  @PrimaryColumn()
  mentor_id!: string;

  @Exclude()
  @PrimaryColumn()
  track_id!: string;

  @CreateDateColumn({ name: 'assigned_at' })
  assignedAt!: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'mentor_id' })
  mentor!: User;

  @ManyToOne(() => Track, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'track_id' })
  track!: Track;
}
