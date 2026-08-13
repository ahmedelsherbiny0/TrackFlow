import type { Request } from 'express';

export function extractToken(request: Request): string | undefined {
  if (typeof request.cookies.token === 'string') {
    return request.cookies.token;
  }
  const [type, token] = request.headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
}
