import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { extractToken } from '../helpers';

@Injectable()
export class GuestGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = extractToken(request);

    if (token) {
      try {
        await this.jwtService.verifyAsync(token, {
          secret: 'secretKey',
        });
        throw new ForbiddenException('You are already logged in');
      } catch (err) {
        if (err instanceof ForbiddenException) {
          throw err;
        }
      }
    }

    return true;
  }
}
