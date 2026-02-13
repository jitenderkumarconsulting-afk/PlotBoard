import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Socket } from 'socket.io';

import { GameState } from '../interfaces/game-state.interface';
import { GameObjectBuilder } from './game-object.builder';
import { GameStateRepository } from '../repositories/game-state.repository';
import { SocketHelper } from '../../../shared/helpers/socket.helper';
import { SocketEvents } from '../../../shared/constants/socket-events';
import { GameStateInfo } from '../interfaces/game-state-info.interface';
import { GameDefaultValues } from '../constants/game-default-values';

@Injectable()
export class GameStartBuilder {
  private readonly logger: Logger;

  constructor(
    private readonly gameObjectBuilder: GameObjectBuilder, // Inject the GameObjectBuilder service
    private readonly gameStateRepository: GameStateRepository, // Inject the GameStateRepository service
    private readonly socketHelper: SocketHelper, // Inject the SocketHelper service
  ) {
    this.logger = new Logger(GameStartBuilder.name);
  }

  /**
   * Attempts to start the game based on specific conditions. If the conditions are met, the game state is updated to mark it as started.
   * @param gameToken The game token representing the room.
   * @param gameState The game state containing player information.
   * @returns A Promise that resolves to the updated game state if the game has started, or null if it hasn't started yet.
   */
  public async startGame(
    gameToken: string,
    gameState: GameState,
  ): Promise<GameState | null> {
    this.logger.log(`startGame :: gameToken - ${gameToken}`);

    // Extract relevant fields from the game state, game state info and game state config.
    const { game_state_info: gameStateInfo } = gameState;
    const {
      game_state_config: gameStateConfig,
      players_count: playersCount,
      started_at: startedAt,
    } = gameStateInfo;
    const { max_players: maxPlayers } = gameStateConfig;

    // Check if the game has already started.
    if (startedAt) {
      // Game is already started, return the current game state object.
      return gameState;
    }

    // Check if the player count is insufficient to start the game.
    if (playersCount !== maxPlayers) {
      // Game cannot start yet due to insufficient players, return null.
      return null;
    }

    try {
      // Attempt to update the game state to mark it as started.
      const updatedGameState = await this.updateGameStateForGameStart(
        gameState,
      );
      this.logger.log(
        `startGame :: updatedGameState - ${JSON.stringify(updatedGameState)}`,
      );

      // Return the updated game state.
      return updatedGameState;
    } catch (error) {
      this.logger.error(`startGame :: error - ${error}`);

      // An error occurred while updating the game state, return null.
      return null;
    }
  }

  /**
   * Updates the game state to mark the game as started.
   * @param gameState The game state object.
   * @returns A Promise that resolves to the updated game state.
   * @throws InternalServerErrorException if there is an error while updating the game state.
   */
  private async updateGameStateForGameStart(
    gameState: GameState,
  ): Promise<GameState> {
    this.logger.log(
      `updateGameStateForGameStart :: gameState - ${JSON.stringify(gameState)}`,
    );

    // Update the game state data object
    const gameStateData: Partial<GameState> =
      this.gameObjectBuilder.buildUpdateGameStateDataForGameStart(gameState);
    this.logger.log(
      `updateGameStateForGameStart :: gameStateData - ${JSON.stringify(
        gameStateData,
      )}`,
    );

    try {
      return this.gameStateRepository.updateGameState(gameStateData);
    } catch (error) {
      this.logger.error(
        `updateGameStateForGameStart :: Error while updating game state to the database`,
      );
      this.logger.error(`updateGameStateForGameStart :: error - ${error}`);
      throw new InternalServerErrorException(
        'Error while updating game state to the database.',
      );
    }
  }

  /**
   * Sends the game start event to the specified WebSocket client and room.
   * This event signals the beginning of a game and provides the initial game state information to clients.
   * @param client The WebSocket client to which the event will be sent.
   * @param gameToken The game token representing the room where the event will be broadcasted.
   * @param gameStateInfo The game state information used to build the event data.
   * @param shouldEmitToRoom Determines whether to emit the event to the room or just the client.
   */
  public sendGameStartEvent(
    client: Socket,
    gameToken: string,
    gameStateInfo: GameStateInfo,
    shouldEmitToRoom: boolean,
  ) {
    this.logger.log(
      `sendGameStartEvent :: gameToken - ${gameToken}, gameStateInfo - ${JSON.stringify(
        gameStateInfo,
      )}`,
    );

    // Build the GameStateInfoResponseDTO from the provided gameStateInfo.
    const gameStateInfoResponse =
      this.gameObjectBuilder.buildGameStateInfoResponse(gameStateInfo);
    this.logger.log(
      `sendGameStartEvent :: gameStateInfoResponse - ${JSON.stringify(
        gameStateInfoResponse,
      )}`,
    );

    // Convert the gameStateInfoResponse object to a JSON string.
    const gameStateInfoResponseRawData = JSON.stringify(gameStateInfoResponse);

    if (shouldEmitToRoom) {
      // Emit the start event to the specified room.
      this.socketHelper.emitEventToRoom(
        client,
        gameToken,
        SocketEvents.START,
        gameStateInfoResponseRawData,
      );
    }

    // Emit the start event to the the client.
    this.socketHelper.emitEventToClient(
      client,
      SocketEvents.START,
      gameStateInfoResponseRawData,
    );
  }
}
