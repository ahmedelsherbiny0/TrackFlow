import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Req,
  Delete,
  Patch,
} from '@nestjs/common';
import type { Request } from 'express';
import { TracksService } from './tracks.service';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AuthGuard } from '../../common/guards/auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { User, UserRole } from '../users/entities/user.entity';
import { Track } from './entities/track.entity';
import { CreateTrackDto } from './dto/create-track.dto';
import { TrackByNamePipe } from './pipes/track-by-name.pipe';
import { MentorByUsernamePipe } from './pipes/mentor-by-username.pipe';
import { RookieByUsernamePipe } from './pipes/rookie-by-username.pipe';
import { AssignmentsService } from '../assignments/assignments.service';
import { CreateAssignmentDto } from '../assignments/dto/create-assignment.dto';

@Controller('tracks')
@UseInterceptors(ClassSerializerInterceptor)
export class TracksController {
  constructor(
    private readonly tracksService: TracksService,
    private readonly assignmentsService: AssignmentsService,
  ) {}

  @Get()
  findAllTracks() {
    return this.tracksService.findAllTracks();
  }

  @Get(':trackName')
  async findTrack(@Param('trackName', TrackByNamePipe) track: Track) {
    return await this.tracksService.findTrack(track.name);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  createTrack(@Body() createTrackDto: CreateTrackDto) {
    return this.tracksService.createTrack(createTrackDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':trackName')
  updateTrack(
    @Param('trackName', TrackByNamePipe) track: Track,
    @Body() updateTrackDto: CreateTrackDto,
  ) {
    return this.tracksService.updateTrack(track, updateTrackDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':trackName')
  removeTrack(@Param('trackName', TrackByNamePipe) track: Track) {
    return this.tracksService.removeTrack(track);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post(':trackName/mentors/:mentorUsername')
  async assignMentor(
    @Param('trackName', TrackByNamePipe) track: Track,
    @Param('mentorUsername', MentorByUsernamePipe) mentor: User,
  ) {
    return await this.tracksService.assignMentor(track, mentor);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':trackName/mentors/:mentorUsername')
  async removeMentor(
    @Param('trackName', TrackByNamePipe) track: Track,
    @Param('mentorUsername', MentorByUsernamePipe) mentor: User,
  ) {
    return await this.tracksService.removeMentor(track, mentor);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ROOKIE)
  @Post(':trackName/rookies')
  async joinTrack(
    @Param('trackName', TrackByNamePipe) track: Track,
    @Req() req: Request & { user: User },
  ) {
    return await this.tracksService.joinTrack(track, req.user);
  }

  @UseGuards(AuthGuard)
  @Delete(':trackName/rookies/:rookieUsername')
  async leaveTrack(
    @Param('trackName', TrackByNamePipe) track: Track,
    @Param('rookieUsername', RookieByUsernamePipe) rookie: User,
    @Req() req: Request & { user: User },
  ) {
    return await this.tracksService.leaveTrack(track, rookie, req.user);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @Get(':trackName/rookies')
  async getRookiesInTrack(
    @Param('trackName', TrackByNamePipe) track: Track,
  ): Promise<User[]> {
    return await this.tracksService.getRookiesInTrack(track);
  }

  @Get(':trackName/assignments')
  getAssignmentsInTrack(@Param('trackName', TrackByNamePipe) track: Track) {
    return this.assignmentsService.findAll(track);
  }

  @Post(':trackName/assignments')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.MENTOR)
  async createAssignmentInTrack(
    @Param('trackName', TrackByNamePipe) track: Track,
    @Body() createAssignmentDto: CreateAssignmentDto,
    @Req() req: Request & { user: User },
  ) {
    return await this.tracksService.createAssignment(
      track,
      createAssignmentDto,
      req.user,
    );
  }
}
