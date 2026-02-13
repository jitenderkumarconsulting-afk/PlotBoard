/**
 * Constants for WebSocket events used in the application.
 */
export class SocketEvents {
  // General room interaction events
  public static readonly JOIN_ROOM = 'join'; // Publish event to join a room.
  public static readonly LEAVE_ROOM = 'leave'; // Publish event to leave a room.

  // Message and acknowledgment events
  public static readonly MESSAGE = 'message'; // Publish/Subscribe event for sending a message.
  public static readonly ACKNOWLEDGE = 'acknowledge'; // Subscribe event to acknowledge receipt or completion of an action.

  // Gameplay-related events
  public static readonly LOAD = 'load'; // Subscribe event for notifying about load game.
  public static readonly PLAYERS = 'players'; // Subscribe event for notifying about players in the game.
  public static readonly START = 'start'; // Subscribe event for handling game start.
  public static readonly TURN = 'turn'; // Subscribe event for handling player's turn.
  public static readonly POSSIBLE_MOVES = 'possible_moves'; // Publish/Subscribe event for handling object possible moves.
  public static readonly MOVE = 'move'; // Publish/Subscribe event for handling object moves.
  public static readonly CAPTURED_OBJECTS = 'captured_objects'; // Subscribe event for handling captured objects.
  public static readonly END = 'end'; // Subscribe event for notifying about game end.
}
