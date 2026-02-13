import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserService } from './services/user.service';
import { UserSchema } from './schemas/user.schema';
import { UserRepository } from './repositories/user.repository';
import { UserBuilder } from './builders/user.builder';
import { UserController } from './controllers/user.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema }, // Import the User model from Mongoose
    ]),
  ],

  // Declare the controllers for the module
  controllers: [UserController],

  // Declare the providers for the module
  providers: [UserService, UserBuilder, Logger, UserRepository],

  // Expose the providers to be used by other modules
  exports: [UserService, UserBuilder],
})
export class UserModule {}
