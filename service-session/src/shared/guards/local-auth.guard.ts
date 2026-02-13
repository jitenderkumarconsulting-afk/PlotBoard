import { HttpException, Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  private readonly logger: Logger;

  constructor() {
    super();

    this.logger = new Logger(LocalAuthGuard.name);
  }

  handleRequest(err: any, user: any, info: any, context: any, status: any) {
    this.logger.log('handleRequest');

    if (err || !user) {
      throw new HttpException(err.message, err.status);
    }
    return user;
  }
}
