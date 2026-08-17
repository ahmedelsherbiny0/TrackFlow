import { IsNotEmpty, IsEnum } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class UpdateUserRoleDto {
  @IsNotEmpty()
  @IsEnum(UserRole, {
    message: 'role must be a valid enum value (Admin, Mentor, Rookie)',
  })
  role!: UserRole;
}
