import { BaseDocument } from '../../../shared/interfaces/base-document.interface';
import { GameStateResult } from './game-state-result.interface';
import { GameStateInfo } from './game-state-info.interface';
import { GameStatePlayer } from './game-state-player.interface';
import { PlayerTurn } from './player-turn.interface';

/**
 * Interface for the GameState model.
 */
export interface GameState {
  // extends BaseDocument
  readonly game_token: string; // Alphanumeric code for the play game URL
  readonly game_state_script: Record<string, any>; // JSON object representing the game state script
  readonly game_state_info: GameStateInfo; // Information about the game state info in the game
  readonly load_run_info: Record<string, any>; // Information about the load run info in the game
  readonly end_run_info: Record<string, any>; // Information about the end run info in the game
  readonly players: Array<GameStatePlayer>; // List of players in the game
  readonly current_turn?: PlayerTurn; // Information about the current player turn in the game
  readonly captured_objects: Array<Record<string, any>>; // List of objects captured during the game
  readonly game_state_result?: GameStateResult; // Result of the overall game state
}
