import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Socket } from 'socket.io';

import { GameState } from '../interfaces/game-state.interface';
import { GameStateRepository } from '../repositories/game-state.repository';
import { SocketEvents } from '../../../shared/constants/socket-events';
import { SocketHelper } from '../../../shared/helpers/socket.helper';
import { GameScriptKeys } from '../constants/game-script-keys';
import { GameObjectBuilder } from './game-object.builder';
import { GameStartBuilder } from './game-start.builder';
import { GamePlayerTurnBuilder } from './game-player-turn.builder';
import { GameCapturedObjectBuilder } from './game-captured-object.builder';

@Injectable()
export class GameBuilder {
  private readonly logger: Logger;

  constructor(
    private readonly gameObjectBuilder: GameObjectBuilder, // Inject the GameObjectBuilder service
    private readonly gameCapturedObjectBuilder: GameCapturedObjectBuilder, // Inject the GameCapturedObjectBuilder service
    private readonly gameStartBuilder: GameStartBuilder, // Inject the GameStartBuilder service
    private readonly gamePlayerTurnBuilder: GamePlayerTurnBuilder, // Inject the GamePlayerTurnBuilder service
    private readonly gameStateRepository: GameStateRepository, // Inject the GameStateRepository service
    private readonly socketHelper: SocketHelper, // Inject the SocketHelper service
  ) {
    this.logger = new Logger(GameBuilder.name);
  }

  /**
   * Checks if a game state exists with the given game token.
   * @param gameToken The game token of the game state to check.
   * @returns A Promise that resolves to the game state object if found.
   * @throws NotFoundException if the game state with the given game URL code does not exist.
   * @throws InternalServerErrorException if there is an error while fetching the game state from the database.
   */
  public async checkIfGameStateExistsByGameToken(
    gameToken: string,
  ): Promise<GameState> {
    this.logger.log(
      `checkIfGameStateExistsByGameToken :: gameToken - ${gameToken}`,
    );

    let gameState: GameState;
    try {
      // Find the game state by game URL code from the gameStateRepository.
      gameState = await this.gameStateRepository.findGameStateByGameUrlCode(
        gameToken,
      );
    } catch (error) {
      this.logger.error(
        `checkIfGameStateExistsByGameToken :: Error while fetching game state from the database`,
      );
      this.logger.error(
        `checkIfGameStateExistsByGameToken :: error - ${error}`,
      );
      throw new InternalServerErrorException(
        'Error while fetching game state from the database.',
      );
    }

    if (!gameState) {
      this.logger.error(
        `checkIfGameStateExistsByGameToken :: Game state with game token ${gameToken} not found`,
      );
      throw new NotFoundException(
        'Game state with the given game URL code not found.',
      );
    }

    return gameState;
  }

  /**
   * Handles WebSocket client actions upon joining a room.
   *
   * @param client - The joined WebSocket client.
   * @param gameToken - The room's game token.
   * @param gameState - The game state with player information.
   */
  public async afterRoomJoined(
    client: Socket,
    gameToken: string,
    gameState: GameState,
  ) {
    this.logger.log(`afterRoomJoined :: gameToken - ${gameToken}`);

    // Send load event information to the clients upon joining the room.
    this.sendLoadEvent(client, gameToken, gameState);

    // Send players information to the clients upon joining the room.
    this.sendPlayersEvent(client, gameToken, gameState);

    // Send captured objects information to the clients upon joining the room.
    this.gameCapturedObjectBuilder.sendCapturedObjectsEvent(
      client,
      gameToken,
      gameState,
    );

    // Try to start the game if conditions are met.
    const updatedGameState = await this.gameStartBuilder.startGame(
      gameToken,
      gameState,
    );

    // If the game hasn't started yet, exit the function.
    if (!updatedGameState) {
      return;
    }

    // Extract relevant fields from the game state and game state info.
    const { game_state_info: gameStateInfo } = gameState;
    const { started_at: startedAt } = gameStateInfo;

    // Extract necessary fields from the updated game state and updated game state info.
    const { game_state_info: updatedGameStateInfo } = updatedGameState;
    const { started_at: updatedStartedAt } = updatedGameStateInfo;

    // Check if the game has just started.
    const isGameStartedNow: boolean = !startedAt && !!updatedStartedAt;

    // Send a game start event to notify clients that the game has begun.
    this.gameStartBuilder.sendGameStartEvent(
      client,
      gameToken,
      updatedGameStateInfo,
      isGameStartedNow,
    );

    // Send a player turn event to clients to indicate whose turn it is to play.
    this.gamePlayerTurnBuilder.sendPlayerTurnEvent(
      client,
      gameToken,
      updatedGameState,
      isGameStartedNow,
    );
  }

  private sendLoadEvent(
    client: Socket,
    gameToken: string,
    gameState: GameState,
  ) {
    this.logger.log(`sendLoadEvent :: gameToken - ${gameToken}`);

    // Extract relevant fields from the game state.
    const { load_run_info: loadRunInfo } = gameState;

    // Stringify the loadRunInfo once and use it for the event.
    const loadRunInfoRawData = JSON.stringify(loadRunInfo);

    this.socketHelper.emitEventToClient(
      client,
      SocketEvents.LOAD,
      loadRunInfoRawData,
    );
  }

  /**
   * Build and sends the players event to the specified client and room.
   * @param client The WebSocket client.
   * @param gameToken The game token representing the room.
   * @param gameState The game state containing player information.
   */
  private sendPlayersEvent(
    client: Socket,
    gameToken: string,
    gameState: GameState,
  ) {
    this.logger.log(`sendPlayersEvent :: gameToken - ${gameToken}`);

    if (!gameState.players) {
      this.logger.error(`sendPlayersEvent :: gameState.players - null`);
      return;
    }

    // Build the GameStatePlayersListResponseDTO from the fetched game state.
    const gameStatePlayersListResponse =
      this.gameObjectBuilder.buildGameStatePlayersListResponse(
        gameState.players,
      );
    this.logger.log(
      `sendPlayersEvent :: gameStatePlayersListResponse length - ${gameStatePlayersListResponse.length}`,
    );

    // Stringify the gameStatePlayersListResponse once and use it for both events.
    const playersListResponseRawData = JSON.stringify(
      gameStatePlayersListResponse,
    );

    // Emit the players event to the specified room and the client.
    this.socketHelper.emitEventToRoom(
      client,
      gameToken,
      SocketEvents.PLAYERS,
      playersListResponseRawData,
    );

    this.socketHelper.emitEventToClient(
      client,
      SocketEvents.PLAYERS,
      playersListResponseRawData,
    );
  }

  /**
   * Checks if an object exists for the player based on their move in the game.
   *
   * @param gameState The current game state.
   * @param objectId
   * @returns The object item if it exists for the player, or null if not found.
   */
  public checkIfObjectExistsForPlayer(
    gameState: GameState,
    objectId: string,
  ): Record<string, any> | null {
    this.logger.log(`checkIfObjectExistsForPlayer :: objectId - ${objectId}`);

    // Check if the objectId is valid; if not, return null.
    if (!objectId) {
      return null;
    }

    // Extract the load run info and current turn from the current game state.
    const { load_run_info: loadRunInfo, current_turn: currentTurn } = gameState;
    const { user_id: playerUserId } = currentTurn;

    this.logger.log(
      `checkIfObjectExistsForPlayer :: playerUserId - ${playerUserId}`,
    );

    // Retrieve the 'OBJECT_LIST' from loadRunInfo.
    const objectList = loadRunInfo[GameScriptKeys.ObjectList.OBJECT_LIST];

    // Check if objectList is an array; if not, return null.
    if (!Array.isArray(objectList)) {
      return null;
    }

    // Find the object item that matches the objectId and playerUserId.
    const objectItem = objectList.find((objectItem) => {
      // Check if the objectId and playerUserId matches.
      return (
        objectId === objectItem[GameScriptKeys.ObjectList.OBJECT_ID] &&
        playerUserId === objectItem[GameScriptKeys.ObjectList.PLAYER_USER_ID]
      );
    });

    this.logger.log(
      `checkIfObjectExistsForPlayer :: objectItem - ${JSON.stringify(
        objectItem,
      )}`,
    );

    // Return the found objectItem or null if not found.
    return objectItem;
  }
}
