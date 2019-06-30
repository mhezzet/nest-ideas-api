import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    if (!request.headers.authorization) {
      throw new HttpException(
        'no authorizaton header provided',
        HttpStatus.FORBIDDEN,
      );
    }
    request.user = this.validateToken(request.headers.authorization);

    return true;
  }

  validateToken(token: string) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded;
    } catch {
      throw new HttpException('invalid token', HttpStatus.FORBIDDEN);
    }
  }
}
