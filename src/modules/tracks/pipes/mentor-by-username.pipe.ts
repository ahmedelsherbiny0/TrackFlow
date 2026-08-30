import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../../users/entities/user.entity';

@Injectable()
export class MentorByUsernamePipe implements PipeTransform<
  string,
  Promise<User>
> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async transform(username: string): Promise<User> {
    const mentor = await this.userRepository.findOne({
      where: { username, role: UserRole.MENTOR },
    });

    if (!mentor) {
      throw new NotFoundException(
        `Mentor with username '${username}' not found`,
      );
    }

    return mentor;
  }
}
