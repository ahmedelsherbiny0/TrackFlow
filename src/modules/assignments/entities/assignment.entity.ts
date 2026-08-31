import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Track } from '../../tracks/entities/track.entity';

@Entity('assignments')
export class Assignment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Track, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'track_id' })
  track!: Track;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'created_by_id' })
  mentor!: User;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({ type: 'timestamp with time zone' })
  deadline!: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
