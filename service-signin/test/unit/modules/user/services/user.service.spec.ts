import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

import { UserService } from '../../../../../src/modules/user/services/user.service';
import { User } from '../../../../../src/modules/user/interfaces/user.interface';

describe('UserService', () => {
  let service: UserService;
  let userModelMock: Partial<Model<User>>;

  const userId = '123';

  beforeEach(async () => {
    userModelMock = {
      find: jest.fn().mockResolvedValue([]),
      create: jest.fn().mockResolvedValue({ id: userId, name: 'John' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getModelToken('User'), useValue: userModelMock },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
