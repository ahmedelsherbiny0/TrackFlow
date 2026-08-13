import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tracks')
export class Track {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column({ name: 'created_at' })
  createdAt!: Date;
}
