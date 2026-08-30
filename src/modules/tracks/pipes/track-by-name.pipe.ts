import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Track } from '../entities/track.entity';

@Injectable()
export class TrackByNamePipe implements PipeTransform<string, Promise<Track>> {
  constructor(
    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,
  ) {}

  async transform(name: string): Promise<Track> {
    const track = await this.trackRepository.findOne({
      where: { name: name },
    });

    if (!track) {
      throw new NotFoundException(`Track with name '${name}' not found`);
    }

    return track;
  }
}
