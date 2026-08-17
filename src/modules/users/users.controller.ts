import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { User, UserRole } from './entities/user.entity';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  displayAll() {
    return this.usersService.findAll();
  }

  @Get(':role')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  displayByRole(@Param('role') role: UserRole) {
    return this.usersService.findByRole(role);
  }

  @Get(':username')
  finduser(@Param('username') username: string) {
    return this.usersService.findOneByUsername(username);
  }

  @Patch(':username')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(
    @Param('username') username: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
    @Req() req: { user: User },
  ) {
    return this.usersService.updateRole(username, updateUserRoleDto, req.user);
  }

  @Delete(':username')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  deleteUser(@Param('username') username: string) {
    return this.usersService.deleteUser(username);
  }
}
