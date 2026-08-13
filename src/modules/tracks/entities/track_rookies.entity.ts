import {
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Track } from './track.entity';

@Entity('track_rookies')
export class TrackRookie {
  @PrimaryColumn()
  rookie_id!: string;

  @PrimaryColumn()
  track_id!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'rookie_id' })
  rookie!: User;

  @ManyToOne(() => Track, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'track_id' })
  track!: Track;

  @CreateDateColumn({ name: 'joined_at' })
  joinedAt!: Date;
}
