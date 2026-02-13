import { Controller, Get, Logger } from '@nestjs/common';
import { ApiExcludeController, ApiTags } from '@nestjs/swagger';

import { AppService } from '../services/app.service';

@ApiExcludeController()
@ApiTags('Root')
@Controller()
export class AppController {
  private readonly logger: Logger;

  constructor(
    private readonly appService: AppService, // Inject AppService
  ) {
    this.logger = new Logger(AppController.name);
  }

  @Get()
  getHello(): string {
    this.logger.log('getHello');

    return this.appService.getHello();
  }
}
