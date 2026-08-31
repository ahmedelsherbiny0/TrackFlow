import { Module } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { TracksController } from './tracks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Track } from './entities/track.entity';
import { TrackMentor } from './entities/track_mentors.entity';
import { TrackRookie } from './entities/track_rookies.entity';
import { User } from '../users/entities/user.entity';
import { AssignmentsModule } from '../assignments/assignments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Track, TrackMentor, TrackRookie, User]),
    AssignmentsModule,
  ],
  controllers: [TracksController],
  providers: [TracksService],
  exports: [TracksService],
})
export class TracksModule {}
