import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { GameService } from './services/game.service';
import { GameSchema } from './schemas/game.schema';
import { GameRepository } from './repositories/game.repository';
import { GameBuilder } from './builders/game.builder';
import { GameController } from './controllers/game.controller';
import { GameUserSchema } from './schemas/game-user.schema';
import { GameUrlSchema } from './schemas/game-url.schema';
import { GameUrlRepository } from './repositories/game-url.repository';
import { UserModule } from '../user/user.module';
import { GameUserRepository } from './repositories/game-user.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Game', schema: GameSchema }, // Import the Game model from Mongoose
      { name: 'GameUser', schema: GameUserSchema }, // Import the GameUser model from Mongoose
      { name: 'GameUrl', schema: GameUrlSchema }, // Import the GameUrl model from Mongoose
    ]),

    // Import UserModule for user-related functionality
    UserModule,
  ],

  // Declare the controllers for the module
  controllers: [GameController],

  // Declare the providers for the module
  providers: [
    GameService,
    GameBuilder,
    Logger,
    GameRepository,
    GameUrlRepository,
    GameUserRepository,
  ],

  // Expose the providers to be used by other modules
  exports: [GameService],
})
export class GameModule {}
