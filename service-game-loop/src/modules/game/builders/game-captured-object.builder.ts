import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Socket } from 'socket.io';

import { GameScriptKeys } from '../constants/game-script-keys';
import { GameState } from '../interfaces/game-state.interface';
import { GameObjectBuilder } from './game-object.builder';
import { GameStateRepository } from '../repositories/game-state.repository';
import { SocketHelper } from '../../../shared/helpers/socket.helper';
import { SocketEvents } from 'src/shared/constants/socket-events';
import { EventMoveRequestDTO } from '../dtos/request/event-move-request.dto';

@Injectable()
export class GameCapturedObjectBuilder {
  private readonly logger: Logger;

  constructor(
    private readonly gameObjectBuilder: GameObjectBuilder, // Inject the GameObjectBuilder service
    private readonly gameStateRepository: GameStateRepository, // Inject the GameStateRepository service
    private readonly socketHelper: SocketHelper, // Inject the SocketHelper service
  ) {
    this.logger = new Logger(GameCapturedObjectBuilder.name);
  }

  /**
   * Finds the captured object in the current game state.
   *
   * @param gameState - The current game state.
   * @param eventMoveRequestDto - The data related to the player's move.
   * @returns The captured object item if found, undefined otherwise.
   */
  public checkCapturedObject(
    gameState: GameState,
    eventMoveRequestDto: EventMoveRequestDTO,
  ): Record<string, any> | undefined {
    this.logger.log(`checkCapturedObject`);

    // Extract necessary information from the move request data.
    const { ObjectID: movedObjectId, to: movedPosition } = eventMoveRequestDto;
    const { Row: movedPositionRow, Column: movedPositionColumn } =
      movedPosition;

    // Extract necessary fields from the game state.
    const { load_run_info: loadRunInfo, current_turn: currentTurn } = gameState;

    // Retrieve the current player's user ID.
    const { user_id: currentPlayerUserId } = currentTurn;

    // Retrieve the list of current objects in the game.
    const currentObjectsList = this.getCurrentObjectsListArray(loadRunInfo);

    // Find the captured object in the current objects list.
    const capturedObjectItem = currentObjectsList.find((objectItem) => {
      // Extract the current position of the object.
      const objectPosition =
        objectItem[GameScriptKeys.ObjectList.CURRENT_POSITION];

      // Check if the object is at the moved position.
      const isObjectAtMovedPosition =
        objectPosition[GameScriptKeys.ObjectList.ROW] === movedPositionRow &&
        objectPosition[GameScriptKeys.ObjectList.COLUMN] ===
          movedPositionColumn;

      // Check if the object is not the same as the moved object.
      const isNotSameObject =
        objectItem[GameScriptKeys.ObjectList.OBJECT_ID] !== movedObjectId;

      // Check if the object belongs to another player.
      const isOtherPlayer =
        objectItem[GameScriptKeys.ObjectList.PLAYER_USER_ID] &&
        currentPlayerUserId !==
          objectItem[GameScriptKeys.ObjectList.PLAYER_USER_ID];

      // Check if the object is capturable.
      const isObjectCapturable =
        objectItem[GameScriptKeys.ObjectList.IS_CAPTURABLE] === true;

      // Return true if the object meets the conditions for being captured.
      return (
        isObjectAtMovedPosition &&
        isNotSameObject &&
        isOtherPlayer &&
        isObjectCapturable
      );
    });

    this.logger.log(
      `checkCapturedObject :: capturedObjectItem - ${JSON.stringify(
        capturedObjectItem,
      )}`,
    );

    // Return the captured object (or undefined if not found).
    return capturedObjectItem;
  }

  /**
   * Retrieves the list of objects from the 'OBJECT_LIST' in the provided load run information.
   *
   * @param loadRunInfo - The load run information containing the 'OBJECT_LIST'.
   * @returns An array of objects or an empty array if 'OBJECT_LIST' is not an array.
   */
  private getCurrentObjectsListArray(
    loadRunInfo: Record<string, any>,
  ): Array<Record<string, any>> {
    // Extract the 'OBJECT_LIST' from loadRunInfo.
    const objectList = loadRunInfo[GameScriptKeys.ObjectList.OBJECT_LIST];

    // Check if 'OBJECT_LIST' is an array, otherwise return an empty array.
    return Array.isArray(objectList) ? objectList : [];
  }

  /**
   * Handles the logic for a captured object in the game.
   *
   * @param client - The WebSocket client.
   * @param gameToken - The game token representing the room.
   * @param gameState - The current game state.
   * @param capturedObjectItem - The captured object item.
   */
  public async handleCapturedObject(
    client: Socket,
    gameToken: string,
    gameState: GameState,
    capturedObjectItem: Record<string, any>,
  ): Promise<void> {
    this.logger.log(
      `handleCapturedObject :: capturedObjectItem - ${JSON.stringify(
        capturedObjectItem,
      )}`,
    );

    // Update the game state for the captured object.
    const updatedGameState = await this.updateGameStateForCapturedObject(
      gameState,
      capturedObjectItem,
    );

    // Send the captured objects event to the room and the client.
    this.sendCapturedObjectsEvent(
      client,
      gameToken,
      updatedGameState,
      capturedObjectItem,
    );
  }

  /**
   * Updates the game state to reflect the capturing of an object.
   *
   * @param gameState - The current game state.
   * @param capturedObjectItem - The captured object item.
   * @returns A promise resolving to the updated game state.
   */
  public async updateGameStateForCapturedObject(
    gameState: GameState,
    capturedObjectItem: Record<string, any>,
  ): Promise<GameState> {
    this.logger.log(
      `updateGameStateForCapturedObject :: capturedObjectItem - ${JSON.stringify(
        capturedObjectItem,
      )}`,
    );

    // Build a data object for updating the game state for a captured object.
    const gameStateData: Partial<GameState> =
      this.gameObjectBuilder.buildUpdateGameStateDataForCapturedObject(
        gameState,
        capturedObjectItem,
      );
    this.logger.log(
      `updateGameStateForCapturedObject :: gameStateData - ${JSON.stringify(
        gameStateData,
      )}`,
    );

    try {
      // Attempt to update the game state in the database.
      return this.gameStateRepository.updateGameState(gameStateData);
    } catch (error) {
      // Handle any errors that occur during the database update.
      this.logger.error(
        `updateGameStateForCapturedObject :: Error updating game state in the database: ${error}`,
      );
      this.logger.error(`updateGameStateForCapturedObject :: error - ${error}`);
      throw new InternalServerErrorException(
        'Error while updating game state in the database.',
      );
    }
  }

  /**
   * Sends a 'CAPTURED_OBJECTS' event to the specified game room and client.
   *
   * @param client - The WebSocket client.
   * @param gameToken - The game token representing the room.
   * @param gameState - The current game state.
   * @param capturedObjectItem - (Optional) The captured object item to include in the event response.
   */
  public sendCapturedObjectsEvent(
    client: Socket,
    gameToken: string,
    gameState: GameState,
    capturedObjectItem?: Record<string, any>,
  ) {
    this.logger.log(`sendCapturedObjectsEvent :: gameToken - ${gameToken}`);

    // Build the 'CAPTURED_OBJECTS' event response using the game state.
    const eventCapturedObjectsResponse =
      this.gameObjectBuilder.buildEventCapturedObjectsResponse(
        gameState,
        capturedObjectItem,
      );

    // Convert the event response to a JSON string for transmission.
    const capturedObjectsEventResponseRawData = JSON.stringify(
      eventCapturedObjectsResponse,
    );

    // Emit the 'CAPTURED_OBJECTS' event to the game room.
    this.socketHelper.emitEventToRoom(
      client,
      gameToken,
      SocketEvents.CAPTURED_OBJECTS,
      capturedObjectsEventResponseRawData,
    );

    // Emit the 'CAPTURED_OBJECTS' event to the client.
    this.socketHelper.emitEventToClient(
      client,
      SocketEvents.CAPTURED_OBJECTS,
      capturedObjectsEventResponseRawData,
    );
  }
}
