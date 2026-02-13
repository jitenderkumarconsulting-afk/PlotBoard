import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from '../../../../src/app/controllers/app.controller';
import { AppService } from '../../../../src/app/services/app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "SampleApp Server!"', () => {
      expect(appController.getHello()).toBe('SampleApp Server!');
    });
  });
});
