import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Assignment } from '../../assignments/entities/assignment.entity';

@Entity('submissions')
export class Submission {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Assignment, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'assignment_id' })
  assignment!: Assignment;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'author_id' })
  author!: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'graded_by' })
  gradedBy!: User;

  @Column()
  name!: string;

  @Column()
  content!: string;

  @Column({ nullable: true })
  grade!: number;

  @CreateDateColumn({ name: 'submitted_at' })
  submittedAt!: Date;

  @Column({ name: 'graded_at', nullable: true })
  gradedAt!: Date;
}
