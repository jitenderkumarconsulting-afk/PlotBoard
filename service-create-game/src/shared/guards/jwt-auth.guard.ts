import { AuthGuard } from '@nestjs/passport';
import {
  Injectable,
  Logger,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger: Logger;

  constructor(private readonly reflector: Reflector) {
    super();

    this.logger = new Logger(JwtAuthGuard.name);
  }

  canActivate(context: ExecutionContext) {
    this.logger.log('canActivate');

    const allowExpiredJwt = this.reflector.get<boolean>(
      'allowExpiredJwt',
      context.getHandler(),
    );
    this.logger.log(`canActivate :: allowExpiredJwt - ${allowExpiredJwt}`);

    const request = context.switchToHttp().getRequest();
    request.allowExpiredJwt = allowExpiredJwt;

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: any) {
    this.logger.log(`handleRequest :: err - ${JSON.stringify(err)}`);
    this.logger.log(`handleRequest :: user - ${JSON.stringify(user)}`);
    this.logger.log(`handleRequest :: info - ${JSON.stringify(info)}`);

    const request = context.switchToHttp().getRequest();
    const allowExpiredJwt = request.allowExpiredJwt;

    this.logger.log(`handleRequest :: allowExpiredJwt - ${allowExpiredJwt}`);

    if (info instanceof TokenExpiredError) {
      if (allowExpiredJwt) {
        // Token expired but still allow access if specified by the route
        this.logger.log(
          'handleRequest :: Token has expired, but still allow access.',
        );
        return user;
      } else {
        // Token expired and access not allowed
        this.logger.log(
          'handleRequest :: Token has expired and access not allowed.',
        );
        throw new UnauthorizedException('Token has expired.');
      }
    }

    return super.handleRequest(err, user, info, context);
  }
}
