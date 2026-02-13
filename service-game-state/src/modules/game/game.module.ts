import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

import { GameService } from './services/game.service';
import { GameSchema } from './schemas/game.schema';
import { GameBuilder } from './builders/game.builder';
import { GameController } from './controllers/game.controller';
import { GameUserSchema } from './schemas/game-user.schema';
import { GameUrlSchema } from './schemas/game-url.schema';
import { GameStateRepository } from './repositories/game-state.repository';
import { GameStateSchema } from './schemas/game-state.schema';
import { GameRepository } from './repositories/game.repository';
import { GameUrlRepository } from './repositories/game-url.repository';
import { DynamoUtilService } from './services/dynamoUtil.service';
import { DynamoDBService } from 'src/shared/services/dynamodb.service';
import { GameObjectBuilder } from './builders/game-object.builder';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Game', schema: GameSchema }, // Import the Game model from Mongoose
      { name: 'GameUser', schema: GameUserSchema }, // Import the GameUser model from Mongoose
      { name: 'GameUrl', schema: GameUrlSchema }, // Import the GameUrl model from Mongoose
      { name: 'GameState', schema: GameStateSchema }, // Import the GameState model from Mongoose
    ]),
  ],

  // Declare the controllers for the module
  controllers: [GameController],

  // Declare the providers for the module
  providers: [
    GameService,
    GameBuilder,
    GameObjectBuilder,
    Logger,
    ConfigService,
    GameRepository,
    GameUrlRepository,
    GameStateRepository,
    DynamoUtilService,
    DynamoDBService,
  ],

  // Expose the providers to be used by other modules
  exports: [GameService],
})
export class GameModule {}
