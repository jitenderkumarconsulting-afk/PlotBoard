import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';

import { GameBuilder } from '../builders/game.builder';
import { SocketHelper } from '../../../shared/helpers/socket.helper';
import { SocketEvents } from '../../../shared/constants/socket-events';
import { PublishEventRequestDTO } from '../../../shared/dtos/request/publish-event-request.dto';
import { EventMoveRequestDTO } from '../dtos/request/event-move-request.dto';
import { GameState } from '../interfaces/game-state.interface';
import { EventPossibleMovesRequestDTO } from '../dtos/request/event-possible-moves-request.dto';
import { GameMoveBuilder } from '../builders/game-move.builder';
import { GameEndBuilder } from '../builders/game-end.builder';

@Injectable()
export class GameService {
  private readonly logger: Logger;

  constructor(
    private readonly gameBuilder: GameBuilder, // Inject the GameBuilder service
    private readonly gameMoveBuilder: GameMoveBuilder, // Inject the GameMoveBuilder service
    private readonly gameEndBuilder: GameEndBuilder, // Inject the GameEndBuilder service
    private readonly socketHelper: SocketHelper, // Inject the SocketHelper service
  ) {
    this.logger = new Logger(GameService.name);
  }

  /**
   * Handles a client joining a room.
   * @param client The WebSocket client.
   * @param rawData The raw data received from the client.
   */
  public async handleJoin(client: Socket, rawData: string) {
    this.logger.log(
      `handleJoin :: clientId - ${client.id}, rawData - ${rawData}`,
    );

    // Convert the raw data to a PublishEventRequestDTO.
    const publishEventRequestDto: PublishEventRequestDTO =
      this.socketHelper.conversionToPublishEventRequestDto(
        client,
        SocketEvents.JOIN_ROOM,
        rawData,
      );

    if (!publishEventRequestDto) {
      this.logger.error(`handleJoin :: publishEventRequestDto - null`);
      // Emit an acknowledge event for failure to the client.
      this.socketHelper.emitFailureAcknowledgeEventToClient(
        client,
        SocketEvents.JOIN_ROOM,
        rawData,
        'Bad Request',
      );

      return;
    }

    const { gameToken } = publishEventRequestDto;

    let gameState: GameState;

    try {
      // Check if the game state with the given game URL code exists and retrieve its entity.
      gameState = await this.gameBuilder.checkIfGameStateExistsByGameToken(
        gameToken,
      );
      this.logger.log(`handleJoin :: gameState - ${JSON.stringify(gameState)}`);
    } catch (error) {
      // Handle the error if the game state retrieval fails.
      this.logger.error(`handleJoin :: error - ${error}`);
    }

    if (!gameState) {
      // Emit an acknowledge event for failure to the client.
      this.socketHelper.emitFailureAcknowledgeEventToClient(
        client,
        SocketEvents.JOIN_ROOM,
        rawData,
        'Game state not found',
      );

      return;
    }

    const isGameEnded = this.gameEndBuilder.checkGameEndCondition(gameState);
    if (isGameEnded) {
      // Emit an acknowledge event for failure to the client.
      this.socketHelper.emitFailureAcknowledgeEventToClient(
        client,
        SocketEvents.JOIN_ROOM,
        rawData,
        isGameEnded,
      );

      return;
    }

    // Make the client join the specified room.
    this.socketHelper.joinRoom(client, gameToken);

    // Emit an acknowledge event for success to the client.
    this.socketHelper.emitSuccessAcknowledgeEventToClient(
      client,
      SocketEvents.JOIN_ROOM,
      gameToken,
      'Room joined',
    );

    // Perform actions after the client has joined the room.
    this.gameBuilder.afterRoomJoined(client, gameToken, gameState);
  }

  /**
   * Handles a client leaving a room.
   * @param client The WebSocket client.
   * @param rawData The raw data received from the client.
   */
  public async handleLeave(client: Socket, rawData: string) {
    this.logger.log(
      `handleLeave :: clientId - ${client.id}, rawData - ${rawData}`,
    );

    // Convert the raw data to a PublishEventRequestDTO.
    const publishEventRequestDto: PublishEventRequestDTO =
      this.socketHelper.conversionToPublishEventRequestDto(
        client,
        SocketEvents.LEAVE_ROOM,
        rawData,
      );

    if (!publishEventRequestDto) {
      this.logger.error(`handleLeave :: publishEventRequestDto - null`);
      // Emit an acknowledge event for failure to the client.
      this.socketHelper.emitFailureAcknowledgeEventToClient(
        client,
        SocketEvents.LEAVE_ROOM,
        rawData,
        'Bad Request',
      );

      return;
    }

    const { gameToken } = publishEventRequestDto;

    // Make the client leave the specified room.
    this.socketHelper.leaveRoom(client, gameToken);

    // Emit an acknowledge event for success to the client.
    this.socketHelper.emitSuccessAcknowledgeEventToClient(
      client,
      SocketEvents.LEAVE_ROOM,
      gameToken,
      'Room left',
    );
  }

  /**
   * Handles a client sending a message to a room.
   * @param client The WebSocket client.
   * @param rawData The raw data received from the client.
   */
  public async handleMessage(client: Socket, rawData: string) {
    this.logger.log(
      `handleMessage :: clientId - ${client.id}, rawData - ${rawData}`,
    );

    // Convert the raw data to a PublishEventRequestDTO.
    const publishEventRequestDto: PublishEventRequestDTO =
      this.socketHelper.conversionToPublishEventRequestDto(
        client,
        SocketEvents.MESSAGE,
        rawData,
      );

    if (!publishEventRequestDto) {
      this.logger.error(`handleMessage :: publishEventRequestDto - null`);
      // Emit an acknowledge event for failure to the client.
      this.socketHelper.emitFailureAcknowledgeEventToClient(
        client,
        SocketEvents.MESSAGE,
        rawData,
        'Bad Request',
      );

      return;
    }

    const { gameToken } = publishEventRequestDto;

    // Emit the message event to the specified room.
    this.socketHelper.emitEventToRoom(
      client,
      gameToken,
      SocketEvents.MESSAGE,
      JSON.stringify(publishEventRequestDto),
    );

    // Emit an acknowledge event for success to the client.
    this.socketHelper.emitSuccessAcknowledgeEventToClient(
      client,
      SocketEvents.MESSAGE,
      rawData,
      'Message event sent',
    );
  }

  /**
   * Handles a client's request for possible moves in a room.
   *
   * @param client - The WebSocket client.
   * @param rawData - The raw data received from the client.
   */
  public async handlePossibleMoves(client: Socket, rawData: string) {
    this.logger.log(
      `handlePossibleMoves :: clientId - ${client.id}, rawData - ${rawData}`,
    );

    // Convert the raw data to a PublishEventRequestDTO.
    const publishEventRequestDto: PublishEventRequestDTO<EventPossibleMovesRequestDTO> =
      this.socketHelper.conversionToPublishEventRequestDto<EventPossibleMovesRequestDTO>(
        client,
        SocketEvents.POSSIBLE_MOVES,
        rawData,
      );

    // Check if the conversion was successful and if the necessary data exists.
    if (!publishEventRequestDto || !publishEventRequestDto.data) {
      this.logger.error(`handlePossibleMoves :: publishEventRequestDto - null`);
      // Emit an acknowledge event for failure to the client.
      this.socketHelper.emitFailureAcknowledgeEventToClient(
        client,
        SocketEvents.POSSIBLE_MOVES,
        rawData,
        'Bad Request',
      );

      return;
    }

    // Extract gameToken, userId, and eventPossibleMovesRequestDto from the converted data.
    const {
      gameToken,
      userId,
      data: eventPossibleMovesRequestDto,
    } = publishEventRequestDto;

    let gameState: GameState;

    try {
      // Check if the game state with the given game URL code exists and retrieve its entity.
      gameState = await this.gameBuilder.checkIfGameStateExistsByGameToken(
        gameToken,
      );
      this.logger.log(
        `handlePossibleMoves :: gameState - ${JSON.stringify(gameState)}`,
      );
    } catch (error) {
      // Handle the error if the game state retrieval fails.
      this.logger.error(`handlePossibleMoves :: error - ${error}`);
    }

    // Check if the game state is not found.
    if (!gameState) {
      // Notify the client of the failure and exit.
      this.socketHelper.emitFailureAcknowledgeEventToClient(
        client,
        SocketEvents.POSSIBLE_MOVES,
        rawData,
        'Game state not found',
      );

      return;
    }

    // Check if the game has ended.
    const isGameEnded = this.gameEndBuilder.checkGameEndCondition(gameState);
    if (isGameEnded) {
      // Emit an acknowledge event for failure to the client.
      this.socketHelper.emitFailureAcknowledgeEventToClient(
        client,
        SocketEvents.POSSIBLE_MOVES,
        rawData,
        isGameEnded,
      );

      return;
    }

    // Extract the current turn from the current game state.
    const { current_turn: currentTurn } = gameState;
    const { user_id: currentTurnUserId, name: currentTurnUserName } =
      currentTurn;

    // Check if it's not the current player's turn.
    if (currentTurnUserId !== userId) {
      // Emit an acknowledge event for failure to the client.
      this.socketHelper.emitFailureAcknowledgeEventToClient(
        client,
        SocketEvents.MOVE,
        rawData,
        `It's currently ${currentTurnUserName}'s turn.`,
      );

      return;
    }

    // Extract the ObjectID.
    const { ObjectID: moveObjectId } = eventPossibleMovesRequestDto;

    // Check if the object exists for the player.
    const moveObject = this.gameBuilder.checkIfObjectExistsForPlayer(
      gameState,
      moveObjectId,
    );

    // Check if the moveObject is not found.
    if (!moveObject) {
      // Notify the client of the failure and exit.
      this.socketHelper.emitFailureAcknowledgeEventToClient(
        client,
        SocketEvents.POSSIBLE_MOVES,
        rawData,
        'Object not found for the player',
      );

      return;
    }

    // Send possible moves event to the client.
    this.gameMoveBuilder.sendPossibleMovesEvent(
      client,
      moveObject,
      eventPossibleMovesRequestDto,
      gameState,
    );

    // Emit an acknowledge event for success to the client.
    this.socketHelper.emitSuccessAcknowledgeEventToClient(
      client,
      SocketEvents.POSSIBLE_MOVES,
      rawData,
      'Possible moves event sent',
    );
  }

  /**
   * Handles a client's move event in a room.
   *
   * @param client - The WebSocket client.
   * @param rawData - The raw data received from the client.
   */
  public async handleMove(client: Socket, rawData: string) {
    this.logger.log(
      `handleMove :: clientId - ${client.id}, rawData - ${rawData}`,
    );

    // Convert the raw data to a PublishEventRequestDTO.
    const publishEventRequestDto: PublishEventRequestDTO<EventMoveRequestDTO> =
      this.socketHelper.conversionToPublishEventRequestDto<EventMoveRequestDTO>(
        client,
        SocketEvents.MOVE,
        rawData,
      );

    // Check if the conversion was successful and if the necessary data exists.
    if (!publishEventRequestDto || !publishEventRequestDto.data) {
      this.logger.error(`handleMove :: publishEventRequestDto - null`);
      // Emit an acknowledge event for failure to the client.
      this.socketHelper.emitFailureAcknowledgeEventToClient(
        client,
        SocketEvents.MOVE,
        rawData,
        'Bad Request',
      );

      return;
    }

    // Extract gameToken, userId, and eventMoveRequestDto from the converted data.
    const {
      gameToken,
      userId,
      data: eventMoveRequestDto,
    } = publishEventRequestDto;

    let gameState: GameState;

    try {
      // Check if the game state with the given game URL code exists and retrieve its entity.
      gameState = await this.gameBuilder.checkIfGameStateExistsByGameToken(
        gameToken,
      );
      this.logger.log(`handleMove :: gameState - ${JSON.stringify(gameState)}`);
    } catch (error) {
      // Handle the error if the game state retrieval fails.
      this.logger.error(`handleMove :: error - ${error}`);
    }

    // Check if the game state is not found.
    if (!gameState) {
      // Notify the client of the failure and exit.
      this.socketHelper.emitFailureAcknowledgeEventToClient(
        client,
        SocketEvents.MOVE,
        rawData,
        'Game state not found',
      );

      return;
    }

    // Check if the game has ended.
    const isGameEnded = this.gameEndBuilder.checkGameEndCondition(gameState);
    if (isGameEnded) {
      // Emit an acknowledge event for failure to the client.
      this.socketHelper.emitFailureAcknowledgeEventToClient(
        client,
        SocketEvents.MOVE,
        rawData,
        isGameEnded,
      );

      return;
    }

    // Extract the current turn from the current game state.
    const { current_turn: currentTurn } = gameState;
    const { user_id: currentTurnUserId, name: currentTurnUserName } =
      currentTurn;

    // Check if it's not the current player's turn.
    if (currentTurnUserId !== userId) {
      // Emit an acknowledge event for failure to the client.
      this.socketHelper.emitFailureAcknowledgeEventToClient(
        client,
        SocketEvents.MOVE,
        rawData,
        `It's currently ${currentTurnUserName}'s turn`,
      );

      return;
    }

    // Extract the ObjectID from the player's move data.
    const { ObjectID: movedObjectId } = eventMoveRequestDto;

    // Check if the object exists for the player.
    const moveObject = this.gameBuilder.checkIfObjectExistsForPlayer(
      gameState,
      movedObjectId,
    );

    // Check if the moveObject is not found.
    if (!moveObject) {
      // Notify the client of the failure and exit.
      this.socketHelper.emitFailureAcknowledgeEventToClient(
        client,
        SocketEvents.MOVE,
        rawData,
        'Object not found for the player',
      );

      return;
    }

    // Validate the move.
    const isValidMove = this.gameMoveBuilder.validateMove(
      gameState,
      eventMoveRequestDto,
      moveObject,
    );

    // Check if the move is not valid.
    if (!isValidMove) {
      // Notify the client of an invalid move and exit.
      this.socketHelper.emitFailureAcknowledgeEventToClient(
        client,
        SocketEvents.MOVE,
        rawData,
        'Not a valid move',
      );

      return;
    }

    // Update the game state to reflect the valid move.
    await this.gameMoveBuilder.updateGameStateForValidMove(
      gameState,
      eventMoveRequestDto,
    );

    // Emit the move event to the specified room.
    this.socketHelper.emitEventToRoom(
      client,
      gameToken,
      SocketEvents.MOVE,
      JSON.stringify(publishEventRequestDto),
    );

    // Emit an acknowledge event for success to the client.
    this.socketHelper.emitSuccessAcknowledgeEventToClient(
      client,
      SocketEvents.MOVE,
      rawData,
      'Move event sent',
    );

    // Perform actions after the client has moved.
    this.gameMoveBuilder.afterMove(
      client,
      gameToken,
      gameState,
      eventMoveRequestDto,
      moveObject,
    );
  }
}
