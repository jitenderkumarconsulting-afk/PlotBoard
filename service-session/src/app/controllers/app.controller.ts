import { Controller, Get, Logger } from '@nestjs/common';
import { ApiExcludeController, ApiTags } from '@nestjs/swagger';

import { AppService } from '../services/app.service';
import { RedisService } from '../../shared/services/redis.service';

@ApiExcludeController()
@ApiTags('Root')
@Controller()
export class AppController {
  private readonly logger: Logger;

  constructor(
    private readonly appService: AppService, // Inject AppService
    private readonly redisService: RedisService,
  ) {
    this.logger = new Logger(AppController.name);
  }

  @Get()
  getHello(): string {
    this.logger.log('getHello');

    return this.appService.getHello();
  }
}
