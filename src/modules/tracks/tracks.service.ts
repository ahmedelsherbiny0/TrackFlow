import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Track } from './entities/track.entity';
import { TrackMentor } from './entities/track_mentors.entity';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/entities/user.entity';
import { TrackRookie } from './entities/track_rookies.entity';

@Injectable()
export class TracksService {
  constructor(
    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,

    @InjectRepository(TrackMentor)
    private readonly trackMentorRepository: Repository<TrackMentor>,

    @InjectRepository(TrackRookie)
    private readonly trackRookieRepository: Repository<TrackRookie>,
  ) {}

  async findAllTracks() {
    const tracks = await this.trackRepository.find({
      relations: { trackMentors: { mentor: true } },
    });
    return tracks;
  }

  async findTrack(name: string) {
    const track = await this.trackRepository.findOne({
      where: { name },
      relations: {
        trackMentors: { mentor: true },
      },
    });

    if (!track) {
      throw new NotFoundException(`Track with name '${name}' not found`);
    }

    return track;
  }

  async createTrack(createTrackDto: CreateTrackDto) {
    createTrackDto.name = createTrackDto.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-');

    const existingTrack = await this.trackRepository.findOne({
      where: { name: createTrackDto.name },
    });

    if (existingTrack) {
      throw new ConflictException(
        `Track with name '${createTrackDto.name}' already exists`,
      );
    }

    const newTrack = this.trackRepository.create(createTrackDto);
    return this.trackRepository.save(newTrack);
  }

  updateTrack(track: Track, updateTrackDto: CreateTrackDto) {
    return this.trackRepository.save({ ...track, ...updateTrackDto });
  }

  removeTrack(track: Track) {
    return this.trackRepository.remove(track);
  }

  async assignMentor(track: Track, mentor: User) {
    const existingMentor = await this.checkExistingMentor(track, mentor);

    if (existingMentor) {
      throw new ConflictException(
        `Mentor with username '${mentor.username}' is already assigned to this track`,
      );
    }

    return this.trackMentorRepository.save({
      track_id: track.id,
      mentor_id: mentor.id,
    });
  }

  async removeMentor(track: Track, mentor: User) {
    const existingMentor = await this.checkExistingMentor(track, mentor);

    if (!existingMentor) {
      throw new NotFoundException(
        `Mentor with username '${mentor.username}' is not assigned to this track`,
      );
    }

    return this.trackMentorRepository.delete({
      mentor_id: mentor.id,
      track_id: track.id,
    });
  }

  async joinTrack(track: Track, user: User) {
    const existingRookie = await this.checkExistingRookie(track, user);

    if (existingRookie) {
      throw new ConflictException(
        `Rookie with username '${user.username}' is already joined to this track`,
      );
    }

    const newTrackRookie = new TrackRookie();
    newTrackRookie.track_id = track.id;
    newTrackRookie.rookie_id = user.id;

    await this.trackRookieRepository.save(newTrackRookie);
  }

  async leaveTrack(track: Track, rookie: User, user: User) {
    const existingRookie = await this.checkExistingRookie(track, rookie);

    if (!existingRookie) {
      throw new NotFoundException(
        `Rookie with username '${rookie.username}' is not joined to this track`,
      );
    }

    const isMentorAssigned = await this.checkExistingMentor(track, user);

    if (
      user.role !== UserRole.ADMIN &&
      !isMentorAssigned &&
      user.id !== rookie.id
    ) {
      throw new ForbiddenException(
        `You are not authorized to remove this rookie from the track`,
      );
    }

    return this.trackRookieRepository.remove(existingRookie);
  }

  async getRookiesInTrack(track: Track): Promise<User[]> {
    const trackRookies = await this.trackRepository.findOne({
      where: { name: track.name },
      relations: {
        trackRookies: { rookie: true },
      },
    });

    if (!trackRookies) {
      throw new NotFoundException(
        `Track with name '${track.name}' has no rookies`,
      );
    }

    return trackRookies.trackRookies.map((tr) => tr.rookie);
  }

  checkExistingMentor(track: Track, mentor: User) {
    return this.trackMentorRepository.findOne({
      where: { mentor_id: mentor.id, track_id: track.id },
    });
  }

  checkExistingRookie(track: Track, rookie: User) {
    return this.trackRookieRepository.findOne({
      where: { rookie_id: rookie.id, track_id: track.id },
    });
  }
}
