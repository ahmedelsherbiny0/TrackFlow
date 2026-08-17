import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createAuthDto: CreateAuthDto) {
    const existingUser = await this.usersService.findOneByEmailOrUsername(
      createAuthDto.email,
      createAuthDto.username,
    );
    if (existingUser) {
      if (existingUser.username === createAuthDto.username) {
        throw new ConflictException('Username already exists');
      } else if (existingUser.email === createAuthDto.email) {
        throw new ConflictException('Email already exists');
      }
    }

    const userPassword = bcrypt.hashSync(createAuthDto.password, 12);
    createAuthDto.password = userPassword;

    const user = await this.usersService.create(createAuthDto);

    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(userData),
      user: userData,
    };
  }

  async login(loginAuthDto: LoginAuthDto) {
    let existingUser: User | null = null;

    if (loginAuthDto.username) {
      existingUser = await this.usersService.findForLoginByUsername(
        loginAuthDto.username,
      );
    } else if (loginAuthDto.email) {
      existingUser = await this.usersService.findForLoginByEmail(
        loginAuthDto.email,
      );
    } else {
      throw new BadRequestException('Username or email is required');
    }

    if (!existingUser) {
      throw new BadRequestException('Invalid credentials');
    }

    const user = existingUser;

    const isMatch = await bcrypt.compare(loginAuthDto.password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Invalid credentials');
    }

    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(userData),
      user: userData,
    };
  }
}
