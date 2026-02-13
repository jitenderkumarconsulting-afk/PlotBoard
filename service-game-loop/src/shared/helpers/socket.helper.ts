import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';

import { AcknowledgeSocketResponseDTO } from '../dtos/response/acknowledge-socket-response.dto';
import { SocketEvents } from '../constants/socket-events';
import { PublishEventRequestDTO } from '../dtos/request/publish-event-request.dto';

/**
 * Helper class for emitting WebSocket events and acknowledge events to clients.
 */
@Injectable()
export class SocketHelper {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger(SocketHelper.name);
  }

  /**
   * Makes a WebSocket client join a specified room.
   * @param client The WebSocket client.
   * @param gameToken The game token representing the room.
   */
  public joinRoom(client: Socket, gameToken: string) {
    this.logger.log(
      `joinRoom :: clientId - ${client.id}, gameToken - ${gameToken}`,
    );

    // Make the client join the specified room.
    client.join(gameToken);

    // Log that the client successfully joined the room.
    this.logger.log(
      `joinRoom :: Client ${client.id} joined room: ${gameToken}`,
    );
  }

  /**
   * Makes a WebSocket client leave a specified room.
   * @param client The WebSocket client.
   * @param gameToken The game token representing the room.
   */
  public leaveRoom(client: Socket, gameToken: string) {
    this.logger.log(
      `leaveRoom :: clientId - ${client.id}, gameToken - ${gameToken}`,
    );

    // Make the client leave the specified room.
    client.leave(gameToken);

    // Log that the client successfully left the room.
    this.logger.log(`leaveRoom :: Client ${client.id} left room: ${gameToken}`);
  }

  /**
   * Emits a specific event to the client.
   * @param client The WebSocket client responsible for emitting the event.
   * @param event The name of the event to be emitted.
   * @param rawData The data associated with the event to be sent to the client.
   */
  public emitEventToClient(client: Socket, event: string, rawData: any) {
    this.logger.log(
      `emitEventToClient :: event - ${event}, rawData - ${rawData}`,
    );

    // Emits the specific event to the client.
    client.emit(event, rawData);
  }

  /**
   * Emits a specific event to a specified room.
   * @param client The WebSocket client responsible for emitting the event.
   * @param roomId The unique identifier of the room to which the event should be emitted.
   * @param event The name of the event to be emitted.
   * @param rawData The data associated with the event to be sent to the room.
   */
  public emitEventToRoom(
    client: Socket,
    roomId: string,
    event: string,
    rawData: any,
  ) {
    this.logger.log(
      `emitEventToRoom :: roomId - ${roomId}, event - ${event}, rawData - ${rawData}`,
    );

    // Emits the specific event to the specified room.
    client.to(roomId).emit(event, rawData);
  }

  /**
   * Emits an acknowledge event for success to the client.
   * @param client The WebSocket client responsible for emitting the event.
   * @param event The name of the event to be acknowledged.
   * @param rawData The data associated with the acknowledge event to be sent to the client.
   * @param message The message to include in the acknowledgment.
   */
  public emitSuccessAcknowledgeEventToClient(
    client: Socket,
    event: string,
    rawData: any,
    message: string,
  ) {
    this.logger.log(
      `emitSuccessAcknowledgeEventToClient :: rawData - ${rawData}`,
    );

    // Create an AcknowledgeSocketResponseDTO to encapsulate the acknowledge data.
    const responseRawData: AcknowledgeSocketResponseDTO = {
      success: true,
      event,
      data: rawData,
      message,
    };

    // Emit an acknowledge event for success to the client.
    this.emitEventToClient(
      client,
      SocketEvents.ACKNOWLEDGE,
      JSON.stringify(responseRawData),
    );
  }

  /**
   * Emits an acknowledge event for failure to the client.
   * @param client The WebSocket client responsible for emitting the event.
   * @param event The name of the event to be acknowledged.
   * @param rawData The data associated with the acknowledge event to be sent to the client.
   * @param message The message to include in the acknowledgment.
   */
  public emitFailureAcknowledgeEventToClient(
    client: Socket,
    event: string,
    rawData: any,
    message: string,
  ) {
    this.logger.log(
      `emitFailureAcknowledgeEventToClient :: rawData - ${rawData}`,
    );

    // Create an AcknowledgeSocketResponseDTO to encapsulate the acknowledge data.
    const responseRawData: AcknowledgeSocketResponseDTO = {
      success: false,
      event,
      data: rawData,
      message,
    };

    // Emit an acknowledge event for failure to the client.
    this.emitEventToClient(
      client,
      SocketEvents.ACKNOWLEDGE,
      JSON.stringify(responseRawData),
    );
  }

  /**
   * Converts raw data received from a client to a PublishEventRequestDTO.
   *
   * @param client - The WebSocket client.
   * @param event - The name of the event.
   * @param rawData - The raw data received from the client.
   * @returns A PublishEventRequestDTO or null if conversion fails.
   */
  public conversionToPublishEventRequestDto<T = Record<string, any>>(
    client: Socket,
    event: string,
    rawData: string,
  ): PublishEventRequestDTO<T> {
    this.logger.log(
      `conversionToPublishEventRequestDto :: clientId - ${client.id}, rawData - ${rawData}`,
    );

    let publishEventRequestDto: PublishEventRequestDTO<T>;

    try {
      if (rawData) {
        // Attempt to parse the data as JSON.
        publishEventRequestDto = JSON.parse(rawData);
      }
    } catch (error) {
      // Log an error if JSON parsing fails.
      this.logger.error(
        `conversionToPublishEventRequestDto :: error - ${error}`,
      );
    }

    // Log the resulting PublishEventRequestDTO.
    this.logger.log(
      `conversionToPublishEventRequestDto :: publishEventRequestDto - ${JSON.stringify(
        publishEventRequestDto,
      )}`,
    );

    if (!publishEventRequestDto) {
      // Emit an acknowledge event for failure to the client.
      this.emitFailureAcknowledgeEventToClient(
        client,
        event,
        rawData,
        'Unable to parse data object',
      );

      return null;
    }

    if (!publishEventRequestDto.gameToken) {
      // Emit an acknowledge event for failure to the client.
      this.emitFailureAcknowledgeEventToClient(
        client,
        event,
        rawData,
        'Game token key not found',
      );

      return null;
    }

    if (!publishEventRequestDto.userId) {
      // Emit an acknowledge event for failure to the client.
      this.emitFailureAcknowledgeEventToClient(
        client,
        event,
        rawData,
        'User id key not found',
      );

      return null;
    }

    return publishEventRequestDto;
  }
}
