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
import { DateHelper } from '../../../shared/helpers/date.helper';

@Injectable()
export class GameEndBuilder {
  private readonly logger: Logger;

  constructor(
    private readonly gameObjectBuilder: GameObjectBuilder, // Inject the GameObjectBuilder service
    private readonly gameStateRepository: GameStateRepository, // Inject the GameStateRepository service
    private readonly socketHelper: SocketHelper, // Inject the SocketHelper service
  ) {
    this.logger = new Logger(GameEndBuilder.name);
  }

  /**
   * Determines the game end condition based on the provided game state.
   *
   * @param gameState - The current game state.
   * @returns A string describing the game end condition, or undefined if the game has not ended.
   */
  public checkGameEndCondition(gameState: GameState): string | undefined {
    this.logger.log(
      `checkGameEndCondition :: gameState - ${JSON.stringify(gameState)}`,
    );

    const { game_state_info: gameInfo, game_state_result: gameResult } =
      gameState;
    const { end_date: endDate } = gameInfo;

    // Initialize the endCondition variable to undefined.
    let endCondition: string | undefined;

    // Check if there is a game result.
    if (gameResult) {
      endCondition = 'Game ended with result';
    }

    // Check if the game has ended based on the end date.
    if (endDate && DateHelper.isMillisecondsInPast(endDate)) {
      endCondition = 'Game time ended';
    }

    this.logger.log(`checkGameEndCondition :: endCondition - ${endCondition}`);

    // Return the endCondition variable.
    return endCondition;
  }

  /**
   * Updates the game state when the game ends with a player's victory.
   *
   * @param gameState - The current game state.
   * @param matchedWinItem - The win item that the player achieved.
   * @returns A Promise that resolves to the updated game state.
   */
  public async updateGameStateForGameEndWithPlayerWon(
    gameState: GameState,
    matchedWinItem: Record<string, any>,
  ): Promise<GameState> {
    this.logger.log(
      `updateGameStateForGameEndWithPlayerWon :: gameState - ${JSON.stringify(
        gameState,
      )}`,
    );

    // Build the data to update the game state for the player's win.
    const gameStateData: Partial<GameState> =
      this.gameObjectBuilder.buildUpdateGameStateDataForGameEndWithPlayerWon(
        gameState,
        matchedWinItem,
      );
    this.logger.log(
      `updateGameStateForGameEndWithPlayerWon :: gameStateData - ${JSON.stringify(
        gameStateData,
      )}`,
    );

    try {
      // Update the game state in the database.
      return this.gameStateRepository.updateGameState(gameStateData);
    } catch (error) {
      // Handle any errors that occur during the update process.
      this.logger.error(
        `updateGameStateForGameEndWithPlayerWon :: Error while updating game state to the database`,
      );
      this.logger.error(`updateGameStateForGameStart :: error - ${error}`);
      throw new InternalServerErrorException(
        'Error while updating game state to the database.',
      );
    }
  }

  /**
   * Sends an 'END' event to a client and the game room when the game ends.
   *
   * @param client - The WebSocket client.
   * @param gameToken - The game token associated with the game.
   * @param gameState - The current game state.
   */
  public sendEndEvent(client: Socket, gameToken: string, gameState: GameState) {
    this.logger.log(`sendEndEvent :: gameToken - ${gameToken}`);

    // Build the 'END' event response using the game state.
    const eventEndResponse =
      this.gameObjectBuilder.buildEventEndResponse(gameState);

    // Convert the event response to a JSON string for transmission.
    const endEventResponseRawData = JSON.stringify(eventEndResponse);

    // Emit the 'END' event to the game room.
    this.socketHelper.emitEventToRoom(
      client,
      gameToken,
      SocketEvents.END,
      endEventResponseRawData,
    );

    // Emit the 'END' event to the client.
    this.socketHelper.emitEventToClient(
      client,
      SocketEvents.END,
      endEventResponseRawData,
    );
  }
}
