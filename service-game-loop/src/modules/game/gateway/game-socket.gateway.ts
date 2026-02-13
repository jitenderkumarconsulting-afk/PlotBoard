import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

import { SocketEvents } from '../../../shared/constants/socket-events';
import { GameService } from '../services/game.service';
import { SocketHelper } from '../../../shared/helpers/socket.helper';

// WebSocketGateway decorator defines this class as a WebSocket gateway.
@WebSocketGateway({ cors: { origin: '*' } })
export class GameSocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger: Logger;

  constructor(
    private readonly gameService: GameService, // Inject the GameService service
    protected readonly socketHelper: SocketHelper, // Inject the SocketHelper service
  ) {
    // Initialize a logger for this WebSocket gateway.
    this.logger = new Logger(GameSocketGateway.name);
  }

  /**
   * Handles a new WebSocket connection.
   * @param client The WebSocket client.
   */
  handleConnection(client: Socket) {
    // Log the WebSocket connection.
    this.logger.log(`handleConnection :: clientId - ${client.id}`);
    // Add authentication and authorization logic here if needed
    // const token = client.handshake.auth.token;
    // const payload = this.authService.verifyToken(token);

    // if (!payload) {
    //   client.disconnect(true);
    // } else {
    //   this.logger.log(`handleConnection :: Client ${client.id} connected. Auth token: ${token}`);
    // }

    this.logger.log(`handleConnection :: Client ${client.id} connected`);
  }

  /**
   * Handles a WebSocket client disconnecting.
   * @param client The WebSocket client.
   */
  handleDisconnect(client: Socket) {
    // Log the WebSocket disconnection.
    this.logger.log(`handleDisconnect :: Client ${client.id} disconnected`);
  }

  /**
   * Handles a client joining a room.
   * @param client The WebSocket client.
   * @param rawData The raw data received from the client.
   */
  @SubscribeMessage(SocketEvents.JOIN_ROOM)
  async handleJoin(client: Socket, rawData: string) {
    this.logger.log(
      `handleJoin :: clientId - ${client.id}, rawData - ${rawData}`,
    );

    // Delegate handling to the GameService for better separation of concerns.
    this.gameService.handleJoin(client, rawData);
  }

  /**
   * Handles a client leaving a room.
   * @param client The WebSocket client.
   * @param rawData The raw data received from the client.
   */
  @SubscribeMessage(SocketEvents.LEAVE_ROOM)
  async handleLeave(client: Socket, rawData: string) {
    this.logger.log(
      `handleLeave :: clientId - ${client.id}, rawData - ${rawData}`,
    );

    // Delegate handling to the GameService for better separation of concerns.
    this.gameService.handleLeave(client, rawData);
  }

  /**
   * Handles a client sending a message to a room.
   * @param client The WebSocket client.
   * @param rawData The raw data received from the client.
   */
  @SubscribeMessage(SocketEvents.MESSAGE)
  async handleMessage(client: Socket, rawData: string) {
    // Log the handling of a message from a client.
    this.logger.log(
      `handleMessage :: clientId - ${client.id}, rawData - ${rawData}`,
    );

    // Delegate handling to the GameService for better separation of concerns.
    this.gameService.handleMessage(client, rawData);
  }

  @SubscribeMessage(SocketEvents.POSSIBLE_MOVES)
  async handlePossibleMoves(client: Socket, rawData: string) {
    this.logger.log(
      `handlePossibleMoves :: clientId - ${client.id}, rawData - ${rawData}`,
    );

    // Delegate handling to the GameService for better separation of concerns.
    this.gameService.handlePossibleMoves(client, rawData);
  }

  /**
   * Handles a client sending a move event to a room.
   * @param client The WebSocket client.
   * @param rawData The raw data received from the client.
   */
  @SubscribeMessage(SocketEvents.MOVE)
  async handleMove(client: Socket, rawData: string) {
    this.logger.log(
      `handleMove :: clientId - ${client.id}, rawData - ${rawData}`,
    );

    // Delegate handling to the GameService for better separation of concerns.
    this.gameService.handleMove(client, rawData);
  }
}
