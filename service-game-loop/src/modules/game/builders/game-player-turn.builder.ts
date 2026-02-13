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
import { PlayerTurn } from '../interfaces/player-turn.interface';

@Injectable()
export class GamePlayerTurnBuilder {
  private readonly logger: Logger;

  constructor(
    private readonly gameObjectBuilder: GameObjectBuilder, // Inject the GameObjectBuilder service
    private readonly gameStateRepository: GameStateRepository, // Inject the GameStateRepository service
    private readonly socketHelper: SocketHelper, // Inject the SocketHelper service
  ) {
    this.logger = new Logger(GamePlayerTurnBuilder.name);
  }

  /**
   * Advances to the next player's turn.
   * @param client The WebSocket client.
   * @param gameToken The game token representing the room.
   * @param gameState The current game state.
   */
  public async advanceToNextPlayerTurn(
    client: Socket,
    gameToken: string,
    gameState: GameState,
  ) {
    // Attempt to advance to the next player's turn.
    const updatedGameState = await this.nextPlayerTurn(gameToken, gameState);

    if (!updatedGameState) {
      // If an error occurred or the game state is not found, return.
      return;
    }

    // Send a player turn event to clients to indicate whose turn it is to play.
    this.sendPlayerTurnEvent(client, gameToken, updatedGameState, true);
  }

  /**
   * Advances the game to the next player's turn.
   * @param gameToken The game token representing the room.
   * @param gameState The current game state.
   * @returns A Promise that resolves to the updated game state, or null if an error occurs.
   */
  private async nextPlayerTurn(
    gameToken: string,
    gameState: GameState,
  ): Promise<GameState | null> {
    this.logger.log(`nextPlayerTurn :: gameToken - ${gameToken}`);

    try {
      // Attempt to update the game state to advance to the next player's turn.
      const updatedGameState = await this.updateGameStateForNextPlayerTurn(
        gameState,
      );
      this.logger.log(
        `nextPlayerTurn :: updatedGameState - ${JSON.stringify(
          updatedGameState,
        )}`,
      );

      // Return the updated game state.
      return updatedGameState;
    } catch (error) {
      // Handle any errors that occur during the game state update.
      this.logger.error(`nextPlayerTurn :: error - ${error}`);

      // An error occurred while updating the game state, return null.
      return null;
    }
  }

  /**
   * Updates the game state to advance to the next player's turn.
   * @param gameState The game state object.
   * @returns A Promise that resolves to the updated game state.
   * @throws InternalServerErrorException if there is an error while updating the game state.
   */
  private async updateGameStateForNextPlayerTurn(
    gameState: GameState,
  ): Promise<GameState> {
    this.logger.log(
      `updateGameStateForNextPlayerTurn :: gameState - ${JSON.stringify(
        gameState,
      )}`,
    );

    // Calculate the next player's turn based on the current game state.
    const nextPlayerTurn = this.calculateNextTurn(gameState);
    this.logger.log(
      `buildUpdateGameStateDataForNextPlayerTurn :: nextPlayerTurn - ${JSON.stringify(
        nextPlayerTurn,
      )}`,
    );

    // Build a data object for updating the game state to the next player's turn.
    const gameStateData: Partial<GameState> =
      this.gameObjectBuilder.buildUpdateGameStateDataForNextPlayerTurn(
        gameState,
        nextPlayerTurn,
      );
    this.logger.log(
      `updateGameStateForNextPlayerTurn :: gameStateData - ${JSON.stringify(
        gameStateData,
      )}`,
    );

    try {
      // Attempt to update the game state in the database.
      return this.gameStateRepository.updateGameState(gameStateData);
    } catch (error) {
      // Handle any errors that occur during the database update.
      this.logger.error(
        `updateGameStateForNextPlayerTurn :: Error while updating game state in the database`,
      );
      this.logger.error(`updateGameStateForNextPlayerTurn :: error - ${error}`);
      throw new InternalServerErrorException(
        'Error while updating game state in the database.',
      );
    }
  }

  /**
   * Sends a player turn event to the specified WebSocket client and room.
   * This event notifies clients whose turn it is to play in the game.
   * @param client The WebSocket client.
   * @param gameToken The game token representing the room.
   * @param gameState The current game state.
   * @param shouldEmitToRoom Determines whether to emit the event to the room or just the client.
   */
  public sendPlayerTurnEvent(
    client: Socket,
    gameToken: string,
    gameState: GameState,
    shouldEmitToRoom: boolean,
  ) {
    this.logger.log(`sendPlayerTurnEvent :: gameToken - ${gameToken}`);

    // Extract the current turn information from the game state.
    const { current_turn: currentTurn } = gameState;

    // Check if the current turn information is valid.
    if (!currentTurn) {
      this.logger.error(`sendPlayerTurnEvent :: currentTurn - null`);
      // Return if the current turn is not valid.
      return;
    }

    // Build a PlayerTurnResponseDTO from the current turn information.
    const playerTurnResponse =
      this.gameObjectBuilder.buildPlayerTurnResponse(currentTurn);
    this.logger.log(
      `sendPlayerTurnEvent :: playerTurnResponse - ${JSON.stringify(
        playerTurnResponse,
      )}`,
    );

    // Convert the playerTurnResponse object to a JSON string.
    const playerTurnResponseRawData = JSON.stringify(playerTurnResponse);

    if (shouldEmitToRoom) {
      // Emit the turn event to the specified room and client.
      this.socketHelper.emitEventToRoom(
        client,
        gameToken,
        SocketEvents.TURN,
        playerTurnResponseRawData,
      );
    }

    // Emit the turn event to the client separately.
    this.socketHelper.emitEventToClient(
      client,
      SocketEvents.TURN,
      playerTurnResponseRawData,
    );
  }

  /**
   * Calculates the next player's turn based on the current turn and player sequence.
   * If the current turn is not found, it defaults to the first player in the sequence.
   * @param gameState The game state containing player information.
   * @returns The PlayerTurn object representing the next player's turn.
   */
  private calculateNextTurn(gameState: GameState): PlayerTurn {
    this.logger.log(
      `calculateNextTurn :: gameState - ${JSON.stringify(gameState)}`,
    );

    // Extract the necessary fields from the game state and game state info.
    const { game_state_info: gameStateInfo, current_turn: currentTurn } =
      gameState;
    const { players_turn_sequence: playersTurnSequence } = gameStateInfo;

    // Find the index of the current turn player in the sequence.
    const currentIndex = playersTurnSequence.findIndex(
      (player) =>
        player.user_id === currentTurn.user_id &&
        player.is_anonymous === currentTurn.is_anonymous,
    );

    // Calculate the index of the next player's turn.
    const nextIndex =
      currentIndex !== -1 ? (currentIndex + 1) % playersTurnSequence.length : 0;

    // Get the next player's turn from the sequence.
    const nextTurn = playersTurnSequence[nextIndex];
    this.logger.log(
      `calculateNextTurn :: nextTurn - ${JSON.stringify(nextTurn)}`,
    );

    return nextTurn;
  }
}
