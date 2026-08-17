import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOneById(id: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }

  async findOneByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ username });
  }

  async findForLoginByUsername(username: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .where('user.username = :username', { username })
      .addSelect('user.password')
      .getOne();
  }

  async findForLoginByEmail(email: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.password')
      .getOne();
  }

  async findOneByEmailOrUsername(
    email: string,
    username: string,
  ): Promise<User | null> {
    return this.usersRepository.findOne({
      where: [{ email }, { username }],
    });
  }

  async create(user: Partial<User>): Promise<User> {
    const newUser = this.usersRepository.create(user);
    return this.usersRepository.save(newUser);
  }

  async updateRole(
    username: string,
    updateUserRoleDto: UpdateUserRoleDto,
    currentUser: User,
  ): Promise<User> {
    if (currentUser.username === username) {
      throw new ForbiddenException('You cannot change your own role');
    }

    const user = await this.findOneByUsername(username);
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }

    if (user.role === updateUserRoleDto.role) {
      throw new ForbiddenException(
        `User already has the role ${updateUserRoleDto.role}`,
      );
    }

    user.role = updateUserRoleDto.role;

    return this.usersRepository.save(user);
  }

  async findByRole(role: UserRole): Promise<User[]> {
    if (!Object.values(UserRole).includes(role)) {
      throw new NotFoundException(`Role ${role} does not exist`);
    }
    return this.usersRepository.find({ where: { role } });
  }

  async deleteUser(username: string): Promise<User> {
    const user = await this.findOneByUsername(username);
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }

    return this.usersRepository.remove(user);
  }
}
