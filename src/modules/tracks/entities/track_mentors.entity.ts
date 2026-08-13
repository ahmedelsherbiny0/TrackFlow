import {
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Track } from './track.entity';

@Entity('track_mentors')
export class TrackMentor {
  @PrimaryColumn()
  mentor_id!: string;

  @PrimaryColumn()
  track_id!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'mentor_id' })
  mentor!: User;

  @ManyToOne(() => Track, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'track_id' })
  track!: Track;

  @CreateDateColumn({ name: 'assigned_at' })
  assignedAt!: Date;
}
