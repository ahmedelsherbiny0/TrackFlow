import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Assignment } from './entities/assignment.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Track } from '../tracks/entities/track.entity';
import { User, UserRole } from '../users/entities/user.entity';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(Assignment)
    private readonly assignmentRepository: Repository<Assignment>,
  ) {}

  findAll(track: Track): Promise<Assignment[]> {
    return this.assignmentRepository.find({
      where: { track: { id: track.id } },
      relations: { mentor: true },
      order: { deadline: 'ASC' },
    });
  }

  findOne(id: string): Promise<Assignment | null> {
    return this.assignmentRepository.findOne({
      where: { id },
      relations: { mentor: true, track: true },
    });
  }

  create(
    createAssignmentDto: CreateAssignmentDto,
    track: Track,
    mentor: User,
  ): Promise<Assignment> {
    const assignment = this.assignmentRepository.create({
      ...createAssignmentDto,
      track,
      mentor,
    });

    return this.assignmentRepository.save(assignment);
  }

  async update(
    assignmentId: string,
    updateAssignmentDto: UpdateAssignmentDto,
    user: User,
  ) {
    const assignment = await this.assignmentRepository.findOne({
      where: { id: assignmentId },
      relations: { mentor: true },
    });

    if (!assignment) {
      throw new NotFoundException(
        `Assignment with ID '${assignmentId}' not found`,
      );
    }

    if (user.role !== UserRole.ADMIN && assignment.mentor.id !== user.id) {
      throw new UnauthorizedException(
        `You do not have permission to update this assignment`,
      );
    }

    if (updateAssignmentDto.deadline) {
      const newDeadline = new Date(updateAssignmentDto.deadline);
      if (newDeadline <= new Date()) {
        throw new BadRequestException(`Deadline cannot be in the past`);
      }
    }

    return await this.assignmentRepository.save({
      ...assignment,
      ...updateAssignmentDto,
    });
  }

  async remove(assignmentId: string, user: User) {
    const assignment = await this.assignmentRepository.findOne({
      where: { id: assignmentId },
      relations: { mentor: true },
    });

    if (!assignment) {
      throw new NotFoundException(
        `Assignment with ID '${assignmentId}' not found`,
      );
    }

    if (user.role !== UserRole.ADMIN && assignment.mentor.id !== user.id) {
      throw new UnauthorizedException(
        `You do not have permission to delete this assignment`,
      );
    }

    return await this.assignmentRepository.remove(assignment);
  }
}
