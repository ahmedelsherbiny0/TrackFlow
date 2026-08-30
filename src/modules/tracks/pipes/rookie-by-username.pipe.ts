import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../../users/entities/user.entity';

@Injectable()
export class RookieByUsernamePipe implements PipeTransform<
  string,
  Promise<User>
> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async transform(username: string): Promise<User> {
    const rookie = await this.userRepository.findOne({
      where: { username, role: UserRole.ROOKIE },
    });

    if (!rookie) {
      throw new NotFoundException(
        `Rookie with username '${username}' not found`,
      );
    }

    return rookie;
  }
}
