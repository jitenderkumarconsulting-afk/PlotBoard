import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger(AppService.name);
  }

  getHello(): string {
    this.logger.log('getHello');

    const APP_NAME = process.env['APP_NAME'];
    const APP_VERSION = process.env.npm_package_version;

    return `${APP_NAME} - ${APP_VERSION}`;
  }
}
