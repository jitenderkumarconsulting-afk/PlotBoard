import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

import { GameService } from './services/game.service';
import { GameBuilder } from './builders/game.builder';
import { GameSocketGateway } from './gateway/game-socket.gateway';
import { GameStateRepository } from './repositories/game-state.repository';
import { DynamoUtilService } from './services/dynamoUtil.service';
import { DynamoDBService } from '../../shared/services/dynamodb.service';
import { GameStateSchema } from './schemas/game-state.schema';
import { SocketHelper } from '../../shared/helpers/socket.helper';
import { GameObjectBuilder } from './builders/game-object.builder';
import { GameMoveBuilder } from './builders/game-move.builder';
import { GameWinBuilder } from './builders/game-win.builder';
import { GameEndBuilder } from './builders/game-end.builder';
import { GameStartBuilder } from './builders/game-start.builder';
import { GamePlayerTurnBuilder } from './builders/game-player-turn.builder';
import { GameCapturedObjectBuilder } from './builders/game-captured-object.builder';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'GameState', schema: GameStateSchema }, // Import the GameState model from Mongoose
    ]),
  ],

  // Declare the controllers for the module
  controllers: [],

  // Declare the providers for the module
  providers: [
    GameSocketGateway,
    GameService,
    GameBuilder,
    GameStartBuilder,
    GamePlayerTurnBuilder,
    GameMoveBuilder,
    GameCapturedObjectBuilder,
    GameWinBuilder,
    GameEndBuilder,
    GameObjectBuilder,
    Logger,
    ConfigService,
    SocketHelper,
    GameStateRepository,
    DynamoUtilService,
    DynamoDBService,
  ],

  // Expose the providers to be used by other modules
  exports: [GameService],
})
export class GameModule {}
