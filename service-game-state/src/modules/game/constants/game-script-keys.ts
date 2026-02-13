/**
 * Utility class for defining keys related to game scripts.
 */
export class GameScriptKeys {
  // Key for the config in the game script.
  public static readonly Config = {
    CONFIG: 'config',
    DESCRIPTION: 'cescription',
    MAX_PLAYERS: 'max_players',
    GAME_DURATION: 'game_duration',
    TURN_DURATION: 'turn_duration',
    INFINITE: 'Infinite',
    GRID: 'grid',
    ROWS: 'rows',
    COLUMNS: 'columns',
  };

  // Key for the events in the game script.
  public static readonly Events = {
    EVENTS: 'Events',
    LOAD: 'LOAD',
    END: 'END',
    RUN: 'Run',
  };

  // Key for the object list in the game script.
  public static readonly ObjectList = {
    OBJECT_LIST: 'ObjectList',
    OBJECT_ID: 'ObjectID',
    PLAYER: 'Player',
    PLAYER_USER_ID: 'PlayerUserID',
    START_POSITION: 'StartPosition',
    CURRENT_POSITION: 'CurrentPosition',
    ROW: 'Row',
    COLUMN: 'Column',
    MOVES: 'Moves',
    FIRST_MOVE_ONLY: 'first_move_only',
    UP: 'UP',
    DOWN: 'DOWN',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
    DIAGONAL: 'DIAGONAL',
    DIAGONAL_UP: 'DIAGONAL_UP',
    DIAGONAL_DOWN: 'DIAGONAL_DOWN',
    DIAGONAL_LEFT: 'DIAGONAL_LEFT',
    DIAGONAL_RIGHT: 'DIAGONAL_RIGHT',
    DIAGONAL_UP_LEFT: 'DIAGONAL_UP_LEFT',
    DIAGONAL_UP_RIGHT: 'DIAGONAL_UP_RIGHT',
    DIAGONAL_DOWN_LEFT: 'DIAGONAL_DOWN_LEFT',
    DIAGONAL_DOWN_RIGHT: 'DIAGONAL_DOWN_RIGHT',
    INFINITE: 'Infinite',
    CAN_JUMP: 'can_jump',
    IS_CAPTURABLE: 'is_capturable',
    TYPE: 'type',
    MOVE_COUNTER: 'move_counter',
  };

  // Key for the win list in the game script.
  public static readonly WinList = {
    WIN_LIST: 'WinList',
    TARGET_POSITION: 'TargetPosition',
    ROW: 'Row',
    COLUMN: 'Column',
    PLAYER: 'Player',
    CONDITION: 'condition',
    OBJECT_TYPES: 'object_types',
  };
}
