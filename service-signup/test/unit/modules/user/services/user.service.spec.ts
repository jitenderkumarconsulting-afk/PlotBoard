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

  // it('should create a new user', async () => {
  //   const createUserRequestDTO: CreateUserRequestDTO = {
  //     name: 'John Doe',
  //     email: 'john@example.com',
  //     phone: '+19876543210',
  //     country: 'US',
  //     created_at: new Date(),
  //   };
  //   const createdUser = await service.createUser(createUserRequestDTO);
  //   expect(createdUser).toBeDefined();
  //   expect(createdUser.name).toEqual(createUserRequestDTO.name);
  //   expect(createdUser.email).toEqual(createUserRequestDTO.email);
  //   expect(userModelMock.create).toHaveBeenCalledWith(createUserRequestDTO); // Verify the create method is called with the expected data
  // });
});
