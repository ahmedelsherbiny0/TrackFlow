import {
  Controller,
  Param,
  Delete,
  ParseUUIDPipe,
  Get,
  UseGuards,
  Req,
  Post,
  Body,
} from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { User, UserRole } from '../users/entities/user.entity';
import { Roles } from '../../common/decorators/roles.decorator';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';

@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Get(':assignmentId')
  findOne(@Param('assignmentId', ParseUUIDPipe) assignmentId: string) {
    return this.assignmentsService.findOne(assignmentId);
  }

  @Post(':assignmentId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  async update(
    @Param('assignmentId', ParseUUIDPipe) assignmentId: string,
    @Body() updateAssignmentDto: UpdateAssignmentDto,
    @Req() req: Request & { user: User },
  ) {
    return this.assignmentsService.update(
      assignmentId,
      updateAssignmentDto,
      req.user,
    );
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @Delete(':assignmentId')
  remove(
    @Param('assignmentId', ParseUUIDPipe) assignmentId: string,
    @Req() req: Request & { user: User },
  ) {
    return this.assignmentsService.remove(assignmentId, req.user);
  }
}
